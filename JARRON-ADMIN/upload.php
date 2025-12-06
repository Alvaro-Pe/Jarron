<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'Método no permitido'
    ]);
    exit;
}

// Verificar que se haya enviado un archivo
if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'success' => false,
        'error' => 'No se recibió ninguna imagen o hubo un error en la carga'
    ]);
    exit;
}

$archivo = $_FILES['imagen'];

// Validar tipo de archivo (solo imágenes)
$tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$tipoArchivo = mime_content_type($archivo['tmp_name']);

if (!in_array($tipoArchivo, $tiposPermitidos)) {
    echo json_encode([
        'success' => false,
        'error' => 'Tipo de archivo no permitido. Solo JPG, PNG o WEBP'
    ]);
    exit;
}

// Validar tamaño del archivo (máximo 5MB)
$tamaňoMaximo = 5 * 1024 * 1024; // 5MB en bytes
if ($archivo['size'] > $tamaňoMaximo) {
    echo json_encode([
        'success' => false,
        'error' => 'El archivo es demasiado grande. Máximo 5MB'
    ]);
    exit;
}

// Obtener la extensión del archivo
$extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));

// Generar nombre único para el archivo
$nombreUnico = 'camiseta_' . uniqid() . '_' . time() . '.' . $extension;

// Ruta donde se guardará (carpeta img)
$carpetaDestino = __DIR__ . '/img/';
$rutaCompleta = $carpetaDestino . $nombreUnico;

// Crear carpeta img si no existe
if (!file_exists($carpetaDestino)) {
    mkdir($carpetaDestino, 0755, true);
}

// Mover el archivo a la carpeta img
if (move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
    // Retornar la ruta relativa para guardarla en Firebase
    echo json_encode([
        'success' => true,
        'rutaImagen' => 'img/' . $nombreUnico,
        'mensaje' => 'Imagen guardada exitosamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Error al guardar la imagen en el servidor'
    ]);
}
?>