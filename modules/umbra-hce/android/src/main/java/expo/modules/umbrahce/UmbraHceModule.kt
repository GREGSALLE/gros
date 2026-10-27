package expo.modules.umbrahce

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.nfc.NfcAdapter
import android.provider.Settings
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class UmbraHceModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("UmbraHce")

    Events("onReaderDetected")

    OnCreate {
      HceEvents.onReaderDetected = { timestamp ->
        sendEvent("onReaderDetected", mapOf("timestamp" to timestamp.toDouble()))
      }
    }

    OnDestroy {
      HceEvents.onReaderDetected = null
    }

    // Guarda el número de usuario que el servicio HCE enviará al lector
    Function("setUserId") { userId: Int ->
      HceStore.saveUserId(context, userId)
    }

    Function("clearUserId") {
      HceStore.clear(context)
    }

    // "ready" | "disabled" | "no_hardware"
    Function("getNfcStatus") {
      val hasHce = context.packageManager.hasSystemFeature(PackageManager.FEATURE_NFC_HOST_CARD_EMULATION)
      val adapter = NfcAdapter.getDefaultAdapter(context)
      when {
        adapter == null || !hasHce -> "no_hardware"
        !adapter.isEnabled -> "disabled"
        else -> "ready"
      }
    }

    Function("openNfcSettings") {
      val intent = Intent(Settings.ACTION_NFC_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
    }
  }
}
