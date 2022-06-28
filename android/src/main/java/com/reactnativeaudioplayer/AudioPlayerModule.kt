package com.reactnativeaudioplayer

import com.facebook.react.bridge.*

class AudioPlayerModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  var mediaManager: MediaManager? = MediaManager(reactContext)

  override fun getName(): String {
    return "AudioPlayer"
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun setResource(stringUri: String, promise: Promise) {
    mediaManager?.setResource(stringUri, promise)
  }

  @ReactMethod
  fun resume() {
    if (mediaManager == null) return
    mediaManager?.resume()
  }

  @ReactMethod
  fun start(promise: Promise) {
    if (mediaManager == null) return
    mediaManager?.start()
    promise.resolve("media started")
  }

  @ReactMethod
  fun pause() {
    if (mediaManager == null) return
    mediaManager?.pause()
  }

  @ReactMethod
  fun stop() {
    if (mediaManager == null) return
    mediaManager?.stop()
    mediaManager = null
  }

  @ReactMethod
  fun setPosition(pos: Int) {
    if (mediaManager == null) return
    mediaManager?.setPosition(pos)
  }

  @ReactMethod
  fun getDuration(promise: Promise) {
    if (mediaManager == null) {
      promise.resolve(0)
      return
    }
    promise.resolve(mediaManager!!.getDuration())
  }

  @ReactMethod
  fun getCurrentPosition(promise: Promise) {
    if (mediaManager == null) {
      promise.resolve(0)
      return
    }
    promise.resolve(mediaManager!!.getCurrentPosition())
  }

}
