package com.reactnativeaudioplayer

import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.MediaPlayer.OnPreparedListener
import android.media.TimedText
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter


class MediaManager(val reactContext: ReactContext) {

  private var player: MediaPlayer? = null
  private var setResourcePromise: Promise? = null;

  init {
    player = MediaPlayer()
    player!!.setOnPreparedListener(object : OnPreparedListener {
      override fun onPrepared(mp: MediaPlayer) {
        setResourcePromise?.resolve("loading success")
        setResourcePromise = null
      }
    })

    player!!.setOnErrorListener(object : MediaPlayer.OnErrorListener {
      @Synchronized
      override fun onError(mp: MediaPlayer?, what: Int, extra: Int): Boolean {
        sendEventToJs(JSActions.ERROR)
        return true
      }
    })

    player!!.setOnCompletionListener(object : MediaPlayer.OnCompletionListener {
      @Synchronized
      override fun onCompletion(p0: MediaPlayer?) {
        sendEventToJs(JSActions.COMPLETION)
      }
    })

    player!!.setAudioAttributes(
      AudioAttributes.Builder()
        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .build()
    )

    player!!.setAudioStreamType(AudioManager.STREAM_MUSIC)
  }

  fun sendEventToJs(eventName: JSActions) {
    this.reactContext.getJSModule(RCTDeviceEventEmitter::class.java).emit("ACTION", eventName.toString())
  }

  fun setResource(url: String, promise: Promise) {
    player!!.reset()
    setResourcePromise = promise
    player!!.setDataSource(url)
    player!!.prepareAsync()
  }

  fun start() {
    if (player == null) return
    player?.start()
    sendEventToJs(JSActions.STARTED)
  }

  fun pause() {
    if (player == null) return
    player?.pause()
    sendEventToJs(JSActions.PAUSED)
  }

  fun resume() {
    if (player == null) return
    player?.start()
    sendEventToJs(JSActions.RESUME)
  }

  fun stop() {
    if (player == null) return
    player?.stop()
    player?.release()
    player = null
  }

  fun setPosition(pos: Int) {
    if (player == null) return
    player?.seekTo(pos)
  }

  fun getDuration(): Int {
    return if (player != null) player!!.duration else 0
  }

  fun getCurrentPosition(): Int {
    return if (player != null) player!!.currentPosition else 0
  }

}
