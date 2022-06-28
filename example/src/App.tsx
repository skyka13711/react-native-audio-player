import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { Player, PlayerEvents, PlayerState } from 'react-native-audio-player';

const TEST_SOUND_URL =
  "https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/advertising.mp3"

const formattedTime = (duration: number): string => {
  if (Number.isNaN(duration) || !duration) return '00:00'
  let result = ''
  // Не, ну малоли :)
  const hours = Math.floor(duration / 3600)
  const min = Math.floor(duration / 60) - (hours * 60)
  const sec = Math.floor(duration % 60)
  if (hours > 0) result = `${hours > 9 ? hours : `0${hours}`}:`
  result += `${min > 9 ? min : `0${min}`}:${sec > 9 ? sec : `0${sec}`}`
  return result
}

export default function App() {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [duration, setDuration] = React.useState<string>("00:00")
  const [currentTime, setCurrentTime] = React.useState<string>("00:00")
  const [playerState, setPlayerState] = React.useState<PlayerState | null>(null)
  const isPlay = playerState === PlayerState.PLAY
  const isPaused = playerState === PlayerState.PAUSED
  const isReady = playerState === PlayerState.READY

  React.useEffect(() => {
    if (!player) return
    if (isReady) {
      player.start()
    }
  }, [playerState])

  React.useEffect(() => {
    const player = new Player();
    setPlayer(player);

    player.on(PlayerEvents.DURATION_UPDATE, (duration) => {
      setDuration(formattedTime(duration / 1000))
    })
    player.on(PlayerEvents.UPDATE_CURRENT_TIME, (currentTime: number) => {
      setCurrentTime(formattedTime(currentTime / 1000))
    })
    player.on(PlayerEvents.CHANGE_STATE, setPlayerState)

    return () => {
      player.destroy()
    }
  }, [])

  const togglePlay = () => {
    if (!player) return
    if (!isPlay && !isPaused && !isReady) {
      player.setResource(TEST_SOUND_URL)
    }
    if (isPaused) {
      player.resume()
      return
    }
    if (!isPaused) {
      player.pause()
      return
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Button
          style={styles.button}
          title={isPlay ? 'paused' : isPaused ? "resume" : 'play'}
          onPress={togglePlay}
        />
        <Text>{currentTime} {duration}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 300,
    alignItems: 'center',
  },
  button: {
    width: 50,
  },
});
