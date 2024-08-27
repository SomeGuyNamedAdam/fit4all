import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from './ThemedView'
import { SurfaceView, ThemedSurfaceProps } from './SurfaceView'
import { ThemedText } from './ThemedText'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { IconProps } from '@expo/vector-icons/build/createIconSet'
import { Glyph } from '@shopify/react-native-skia'

type IoniconName = keyof typeof Ionicons.glyphMap

export type FeatureBoxProps = Partial<ThemedSurfaceProps> & {
  lightColor? : string;
  darkColor? : string;
  title?: string;
  message?: string;
  ionicon?: IoniconName;
  color?: string;
}
const FeatureBox = ({
  style,
  lightColor,
  darkColor,
  title = 'Title',
  message = 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
  ionicon = 'add-circle',
  color,
  ...rest
}: FeatureBoxProps) => {
  const textColor = useThemeColor({light : lightColor, dark: darkColor}, 'text')
  return (
    <SurfaceView type="modal" style={styles.view}>
      <View style={styles.row}>
      <Ionicons
      name={ionicon}
      size={24}
      color={ color ? color : textColor}
      />
      <ThemedText type='subtitle'>{title}</ThemedText>
      </View>
      <ThemedText>{message}</ThemedText>
    </SurfaceView>
  )
}

export default FeatureBox

const styles = StyleSheet.create({
  view: {
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 10
  }
})