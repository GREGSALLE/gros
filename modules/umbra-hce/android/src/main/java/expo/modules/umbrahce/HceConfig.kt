package expo.modules.umbrahce

/**
 * Parámetros del protocolo con el lector NFC (firmware del profesor).
 *
 * El lector manda: 00 A4 04 00 05 F0 12 34 56 78 00  (SELECT AID)
 * y espera:        [4 bytes de número de usuario] 90 00
 */
object HceConfig {
    /** Debe coincidir con <aid-filter> en res/xml/umbra_apduservice.xml */
    const val AID_HEX = "F012345678"

    val AID: ByteArray = AID_HEX.chunked(2).map { it.toInt(16).toByte() }.toByteArray()

    /**
     * ScannerHTTP.ino copia los 4 bytes recibidos con memcpy(&id, userId, 4) sobre un
     * uint32_t. El Arduino Nano ESP32 es little-endian, así que el primer byte enviado
     * es el menos significativo. Poner en false para enviar big-endian.
     */
    const val LITTLE_ENDIAN = true

    // Status words de ISO 7816-4
    val SW_OK = byteArrayOf(0x90.toByte(), 0x00)
    val SW_FILE_NOT_FOUND = byteArrayOf(0x6A, 0x82.toByte())
    val SW_CONDITIONS_NOT_SATISFIED = byteArrayOf(0x69, 0x85.toByte())
}
