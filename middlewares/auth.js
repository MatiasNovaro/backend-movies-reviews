import jwt from 'jsonwebtoken';

export default function auth (req, res, next) {
 // Verifica si el token existe en la cabecera 'Authorization'
 const authHeader = req.headers['authorization'];
  
 if (!authHeader) {
   return res.status(401).json({ message: 'Access Denied.' });
 }

 // El token suele ser enviado en la forma "Bearer <token>", así que eliminamos la palabra "Bearer"
 const token = authHeader.split(' ')[1];

 if (!token) {
   return res.status(401).json({ message: 'Access Denied.' });
 }

 // Verificar el token
 jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
   if (err) {
     return res.status(403).json({ message: 'Access Denied.' });
   }
   
   // Guardar el usuario en la request para usarlo en la ruta
   req.user = user;
   next();
 });
};