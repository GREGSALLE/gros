package expo.modules.umbrahce

import android.content.Context

/**
 * Guarda el número de usuario con el que se inició sesión, para que el servicio HCE
 * pueda leerlo aunque la app esté en segundo plano. Se borra al cerrar sesión.
 */
object HceStore {
    private const val PREFS = "umbra_credential"
    private const val KEY_USER_ID = "user_id"

    private fun prefs(context: Context) =
        context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun saveUserId(context: Context, userId: Int) {
        prefs(context).edit().putInt(KEY_USER_ID, userId).apply()
    }

    fun getUserId(context: Context): Int? {
        val p = prefs(context)
        return if (p.contains(KEY_USER_ID)) p.getInt(KEY_USER_ID, 0) else null
    }

    fun clear(context: Context) {
        prefs(context).edit().remove(KEY_USER_ID).apply()
    }
}
