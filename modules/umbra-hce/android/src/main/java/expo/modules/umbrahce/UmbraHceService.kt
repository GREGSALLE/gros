package expo.modules.umbrahce

import android.content.Context
import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log
import java.nio.ByteBuffer
import java.nio.ByteOrder

/** Puente simple servicio → módulo JS. El módulo registra aquí su callback. */
object HceEvents {
    @Volatile
    var onReaderDetected: ((Long) -> Unit)? = null
}

/**
 * Emula una tarjeta NFC (HCE). Ante el SELECT con nuestro AID respondemos con el
 * número de usuario en 4 bytes + 90 00. La app no sabe si el lector da o niega el
 * acceso: esa decisión es del escáner.
 */
class UmbraHceService : HostApduService() {

    private var selected = false
    private var lastVibration = 0L

    override fun processCommandApdu(commandApdu: ByteArray, extras: Bundle?): ByteArray {
        val userId = HceStore.getUserId(applicationContext)
            ?: return HceConfig.SW_CONDITIONS_NOT_SATISFIED

        if (isSelectForOurAid(commandApdu)) {
            selected = true
        } else if (!selected) {
            return HceConfig.SW_FILE_NOT_FOUND
        }

        Log.d(TAG, "APDU IN: " + commandApdu.joinToString(" ") { "%02X".format(it) } + " -> usuario $userId")
        HceEvents.onReaderDetected?.invoke(System.currentTimeMillis())
        vibrateOnce()

        val order = if (HceConfig.LITTLE_ENDIAN) ByteOrder.LITTLE_ENDIAN else ByteOrder.BIG_ENDIAN
        val idBytes = ByteBuffer.allocate(4).order(order).putInt(userId).array()
        return idBytes + HceConfig.SW_OK
    }

    override fun onDeactivated(reason: Int) {
        Log.d(TAG, "onDeactivated reason=$reason")
        selected = false
    }

    /** SELECT by name: 00 A4 04 00 <Lc> <AID...> [Le] */
    private fun isSelectForOurAid(apdu: ByteArray): Boolean {
        if (apdu.size < 5) return false
        if (apdu[0] != 0x00.toByte() || apdu[1] != 0xA4.toByte() || apdu[2] != 0x04.toByte()) return false
        val lc = apdu[4].toInt() and 0xFF
        if (apdu.size < 5 + lc) return false
        return apdu.copyOfRange(5, 5 + lc).contentEquals(HceConfig.AID)
    }

    @Suppress("DEPRECATION")
    private fun vibrateOnce() {
        val now = System.currentTimeMillis()
        if (now - lastVibration < 1500) return
        lastVibration = now
        try {
            val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator ?: return
            vibrator.vibrate(VibrationEffect.createOneShot(120, VibrationEffect.DEFAULT_AMPLITUDE))
        } catch (e: Exception) {
            Log.d(TAG, "no se pudo vibrar: ${e.message}")
        }
    }

    companion object {
        private const val TAG = "UmbraHCE"
    }
}
