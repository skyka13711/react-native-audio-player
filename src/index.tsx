import { EmitterSubscription, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { NativeActions, PlayerEvents, PlayerState } from './types';

type AudioPlayer = {
  getCurrentPosition: () => Promise<number>;
  getDuration: () => Promise<number>;
  setPosition: (pos: number) => void;
  stop: () => void;
  start: () => Promise<string>;
  resume: () => void;
  pause: () => void
  setResource: (url: string | null) => void;
};

const LINKING_ERROR =
  `The package 'react-native-audio-player' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const AudioPlayer: AudioPlayer = NativeModules.AudioPlayer
  ? NativeModules.AudioPlayer
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );


type Listeners = { [key in string]: (...args: any) => void }

export class Player {
  private _listeners: Listeners = {};
  private _eventEmmiter = new NativeEventEmitter(NativeModules.AudioPlayer)
  private _currentTimeoutId: NodeJS.Timeout | null = null
  private _interval: number;
  private _nativeListeners: EmitterSubscription | null;

  private _currentState: PlayerState;

  private set currentState(newValue: PlayerState) {
    this._currentState = newValue
    this.invokeCallback(PlayerEvents.CHANGE_STATE, newValue)
  }

  private _duration: number = 0;

  private set duration(newValue) {
    this._duration = newValue
    this.invokeCallback(PlayerEvents.DURATION_UPDATE, newValue)
  }

  get duration() {
    return this._duration;
  }

  public get isPlay(): boolean {
    return this._currentState === PlayerState.PLAY
  }

  public get isPaused(): boolean {
    return this._currentState === PlayerState.PAUSED
  }

  private invokeCallback(eventName: PlayerEvents, ...args: any) {
    if (this._listeners[eventName] !== undefined) {
      this._listeners[eventName](...args)
    }
  }

  private setMyInterval() {
    this._currentTimeoutId = setTimeout(() => {
      if (!this.isPlay) return
      this.getCurrentPosition().then((number) => {
        this.invokeCallback(PlayerEvents.UPDATE_CURRENT_TIME, number)
      })
      this.setMyInterval()
    }, this._interval)
  }

  private clearMyInterval() {
    if (!this._currentTimeoutId) return
    clearTimeout(this._currentTimeoutId)
  }

  constructor(interval = 100) {
    this._currentState = PlayerState.INITIAL
    this._interval = interval
    this._nativeListeners = this._eventEmmiter.addListener("ACTION", (action: NativeActions) => {
      switch (action) {
        case NativeActions.COMPLETION: {
          this.currentState = PlayerState.COMPLETION
          this.clearMyInterval()
          break
        }
        case NativeActions.ERROR: {
          this.currentState = PlayerState.ERROR
          this.clearMyInterval()
          this.invokeCallback(PlayerEvents.ERROR)
          break
        }
        case NativeActions.PAUSED: {
          this.currentState = PlayerState.PAUSED
          this.clearMyInterval()
          break
        }
        case NativeActions.RESUME: {
          this.currentState = PlayerState.PLAY
          this.setMyInterval()
          break
        }
        case NativeActions.STARTED: {
          this.setMyInterval()
          this.currentState = PlayerState.PLAY
          break
        }
      }
    })
  }

  private async getDuration() {
    const duration = await AudioPlayer.getDuration()
    this.duration = duration
  }

  public async setResource(url: string) {
    await AudioPlayer.setResource(url)
    await this.getDuration()
    this.currentState = PlayerState.READY
  }

  public on(eventName: PlayerEvents, callback: (...args: any) => void) {
    this._listeners[eventName] = callback;
  }

  public off(eventName: PlayerEvents) {
    delete this._listeners[eventName];
  }

  public start() {
    AudioPlayer.start();
  }

  public pause() {
    AudioPlayer.pause()
  }

  public getCurrentPosition() {
    return AudioPlayer.getCurrentPosition();
  }

  public resume() {
    AudioPlayer.resume()
  }

  public destroy() {
    this._nativeListeners?.remove()
    this._nativeListeners = null
    this._listeners = {}
  }

}

export * from './types'
