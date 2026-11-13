const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos con tu contraseña
const db = mysql.createConnection({
    host: '127.0.0.1', 
    port: 3306,
    user: 'root', 
    password: '261193leo',
    database: 'Base_Datos_Proyecto_localjobs'
});

db.connect((err) => {
    if (err) console.error("❌ Error de conexión:", err.message);
    else console.log("✅ Conectado a la DB Base_Datos_Proyecto_localjobs");
});

// Ruta raíz para verificar estado del servidor
app.get("/", (req, res) => {
  res.status(200).send("Servidor backend corriendo exitosamente");
});

// -------------------------------------------------------------
// RUTAS DE AUTENTICACIÓN
// -------------------------------------------------------------

// Endpoint del Login (Unificado con la estructura correcta de columnas)
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  const query = `
    SELECT 'trabajador' AS tipo, id, nombre_completo AS nombre, empresa 
    FROM FormularioTrabajador 
    WHERE email = ? AND password = ?
    UNION
    SELECT 'empleador' AS tipo, id, nombre_completo AS nombre, empresa 
    FROM FormularioEmpleador 
    WHERE email = ? AND password = ?
  `;

  db.query(query, [email, password, email, password], (err, result) => {
    if (err) {
      console.error("Error SQL en /login:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        usuario: result[0]
      });
    } else {
      res.status(401).json({ success: false, message: "Datos incorrectos" });
    }
  });
});

// Registrar Trabajador
app.post('/registrar-trabajador', (req, res) => {
    const { nombre_completo, email, password, telefono, ciudad, oficio, empresa } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "El formato del correo electrónico es inválido." });
    }

    const sql = `INSERT INTO FormularioTrabajador (nombre_completo, email, password, telefono, ciudad, oficio, empresa) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [nombre_completo, email, password, telefono, ciudad, oficio, empresa || null], (err) => {
        if (err) {
          console.error("Error al registrar trabajador:", err);
          return res.status(500).json({ error: "Error al registrar" });
        }
        res.status(200).json({ message: "Trabajador registrado con éxito" });
    });
});

// Registrar Empleador (Adaptado a las nuevas columnas de la Opción 1)
app.post('/registrar-empleador', (req, res) => {
  const { 
      nombre_empresa, 
      tipo_documento, 
      numero_documento, 
      telefono, 
      ubicacion, 
      email, 
      password 
  } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "El formato del correo electrónico es inválido." });
  }

  // Consulta adaptada para guardar todos los datos detallados en la tabla
  const sql = `
      INSERT INTO FormularioEmpleador 
      (empresa, nombre_completo, tipo_documento, numero_documento, telefono, ubicacion, email, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Guardamos 'nombre_empresa' tanto en la columna 'empresa' como en 'nombre_completo' para compatibilidad con el Login
  db.query(sql, [nombre_empresa, nombre_empresa, tipo_documento, numero_documento, telefono, ubicacion, email, password], (err, result) => {
      if (err) {
        console.error("Error al registrar empleador:", err);
        return res.status(500).json({ error: "Error al registrar en la base de datos" });
      }
      
      // Devolvemos el éxito y los datos del usuario para el auto-login
      res.status(200).json({ 
          message: "Empleador registrado con éxito",
          usuario: {
              id: result.insertId,
              empresa: nombre_empresa,
              nombre: nombre_empresa,
              email: email
          }
      });
  });
});

// -------------------------------------------------------------
// RUTAS DE VACANTES Y POSTULACIONES
// -------------------------------------------------------------

// Editar una vacante existente
app.put('/vacantes/:id', (req, res) => {
  console.log("¡Llegó una petición PUT para actualizar la vacante ID:", req.params.id);
  console.log("Datos recibidos:", req.body);
  const vacanteId = req.params.id;
  const { titulo, descripcion, ubicacion, salario } = req.body;

  const sql = `UPDATE Vacantes SET titulo = ?, descripcion = ?, ubicacion = ?, salario = ? WHERE id = ?`;

  db.query(sql, [titulo, descripcion, ubicacion, salario, vacanteId], (err, result) => {
    if (err) {
      console.error("Error al actualizar la vacante:", err);
      return res.status(500).json({ error: "Error al actualizar la vacante" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vacante no encontrada" });
    }
    res.json({ message: "Vacante actualizada con éxito" });
  });
});

// Eliminar una vacante
app.delete('/vacantes/:id', (req, res) => {
  console.log("¡Llegó una petición DELETE para la vacante ID:", req.params.id);
  const vacanteId = req.params.id;

  const sql = `DELETE FROM Vacantes WHERE id = ?`;

  db.query(sql, [vacanteId], (err, result) => {
    if (err) {
      console.error("Error al eliminar la vacante:", err);
      return res.status(500).json({ error: "Error al eliminar la vacante" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vacante no encontrada" });
    }
    res.json({ message: "Vacante eliminada con éxito" });
  });
});

// Obtener todas las vacantes disponibles para los trabajadores
app.get('/vacantes', (req, res) => {
  const sql = `
    SELECT v.*, e.empresa AS nombre_empresa, e.nombre_completo AS nombre_empleador
    FROM Vacantes v
    JOIN FormularioEmpleador e ON v.empleador_id = e.id
    ORDER BY v.id DESC
  `;
  
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error al obtener las vacantes:', err);
      return res.status(500).json({ error: 'Error al obtener las vacantes' });
    }
    res.json(rows);
  });
});

// Publicar una nueva vacante
app.post('/vacantes', (req, res) => {
    const { empleador_id, titulo, descripcion, ubicacion, salario } = req.body;

    const sql = `INSERT INTO Vacantes (empleador_id, titulo, descripcion, ubicacion, salario) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sql, [empleador_id, titulo, descripcion, ubicacion, salario], (err, result) => {
        if (err) {
          console.error("Error al publicar vacante:", err);
          return res.status(500).json({ error: "Error al guardar la vacante en la base de datos" });
        }
        res.status(201).json({ message: "Vacante publicada con éxito", id: result.insertId });
    });
});

// Obtener vacantes publicadas por un empleador específico
app.get('/vacantes/empleador/:empleadorId', (req, res) => {
  const { empleadorId } = req.params;
  const sql = `
    SELECT 
      v.*, 
      COUNT(p.id) AS total_postulaciones
    FROM Vacantes v
    LEFT JOIN postulaciones p ON v.id = p.vacante_id
    WHERE v.empleador_id = ?
    GROUP BY v.id
    ORDER BY v.id DESC
  `;
  
  db.query(sql, [empleadorId], (err, rows) => {
    if (err) {
      console.error('Error al obtener vacantes del empleador:', err);
      return res.status(500).json({ error: 'Error al obtener las vacantes' });
    }
    res.json(rows);
  });
});

// Obtener postulantes de una vacante específica
app.get('/vacantes/:id/postulaciones', (req, res) => {
  const vacanteId = req.params.id;
  const sql = `
    SELECT 
      p.id AS postulacion_id, 
      t.id AS trabajador_id, 
      t.nombre_completo, 
      t.email, 
      t.telefono, 
      t.ciudad, 
      t.oficio
    FROM postulaciones p
    JOIN FormularioTrabajador t ON p.trabajador_id = t.id
    WHERE p.vacante_id = ?
  `;
  
  db.query(sql, [vacanteId], (err, rows) => {
    if (err) {
      console.error('Error al obtener postulantes:', err);
      return res.status(500).json({ error: 'Error al obtener los postulantes' });
    }
    res.json(rows);
  });
});

// -------------------------------------------------------------
// RUTAS DE POSTULACIONES (Para el panel del trabajador)
// -------------------------------------------------------------

// Registrar una postulación de un trabajador a una vacante
app.post('/postulaciones', (req, res) => {
  const { vacante_id, trabajador_id } = req.body;

  const sql = `INSERT INTO postulaciones (vacante_id, trabajador_id) VALUES (?, ?)`;
  
  db.query(sql, [vacante_id, trabajador_id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Ya te encuentras postulado a esta oferta.' });
      }
      console.error("Error al registrar postulación:", err);
      return res.status(500).json({ error: "Error al postularse" });
    }
    res.status(201).json({ message: "Postulación exitosa", id: result.insertId });
  });
});

// Obtener las postulaciones hechas por un trabajador específico
app.get('/postulaciones/trabajador/:trabajadorId', (req, res) => {
  const { trabajadorId } = req.params;
  const sql = `SELECT * FROM postulaciones WHERE trabajador_id = ?`;
  
  db.query(sql, [trabajadorId], (err, rows) => {
    if (err) {
      console.error('Error al obtener postulaciones del trabajador:', err);
      return res.status(500).json({ error: 'Error al obtener las postulaciones' });
    }
    res.json(rows);
  });
});

app.listen(3001, () => console.log("🚀 Servidor de LocalJobs ejecutándose en el puerto 3001"));