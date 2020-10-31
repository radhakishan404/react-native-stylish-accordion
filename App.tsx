import React, { useState, ReactNode } from 'react';
import {
    StyleSheet,
    LayoutChangeEvent,
    TextStyle,
    ViewStyle,
    TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { View, Text, Image } from 'react-native-animatable';
import { useTimingTransition, mix } from 'react-native-redash';

const { interpolate } = Animated;

interface AccordionListProps {
    title?: string
    titleStyle?: TextStyle
    headerStyle?: ViewStyle
    subContainerStyle?: ViewStyle
    children?: ReactNode
    containerRadius?: number
    iconSize?: number
    open: boolean
    onPress: () => void
    style?: ViewStyle
    headerComponent?: ReactNode
    timingTransition?: number,
    activeOpacity?: number
}

interface ChevronProps {
    duration?: number
    fill?: string
    iconSize?: number
    clicked?: boolean
}

const Icon = ({ duration, iconSize, clicked }: ChevronProps) => {
    return (
        <TouchableOpacity activeOpacity={1} style={styles.iconStyle}>
            <Image
                animation={clicked ? "shake" : "rotate"}
                style={{ width: iconSize, height: iconSize }}
                source={!clicked ? require('./plus.png') : require('./minus.png')}
            />
        </TouchableOpacity>
    )
}

export default ({
    title,
    titleStyle,
    headerStyle,
    subContainerStyle,
    children,
    iconSize = 24,
    open,
    onPress,
    style,
    headerComponent,
    timingTransition = 400,
    containerRadius = 0,
    activeOpacity = 1
}: AccordionListProps) => {
    const [clicked, setClicked] = useState(false);

    const [containerHeight, setContainerHeight] = useState<number | null>(null);
    const transition = useTimingTransition(open, { duration: timingTransition })
    const handleOnLayout = (e: LayoutChangeEvent) => {
        if (!containerHeight) {
            setContainerHeight(e.nativeEvent.layout.height)
        }
    }
    const bottomRadius = interpolate(transition, {
        inputRange: [0, containerRadius / 400],
        outputRange: [containerRadius, 0]
    });

    const height = mix(transition, 0, containerHeight ?? 0);

    const functionCombined = () => {
        setClicked(!clicked);
        onPress();
    }

    return (
        <>
            <View style={styles.panel}>
                <View style={styles.panel_heading}>
                    <TouchableOpacity activeOpacity={activeOpacity} onPress={() => functionCombined()}>
                        <Animated.View style={[
                            styles.heading,
                            headerStyle,
                            {
                                borderBottomLeftRadius: bottomRadius,
                                borderBottomRightRadius: bottomRadius,
                                borderTopLeftRadius: containerRadius,
                                borderTopRightRadius: containerRadius
                            }
                        ]}>
                            {title ? <Text style={[titleStyle, styles.panel_title]}>{title}</Text> : headerComponent}
                            {title ? <Icon iconSize={iconSize} {...{ transition }} clicked={clicked} /> : null}
                        </Animated.View>
                    </TouchableOpacity>
                    <Animated.View
                        onLayout={handleOnLayout}
                        style={[styles.items, { height }]}>
                        <View
                            style={[
                                styles.item,
                                subContainerStyle,
                                {
                                    borderBottomLeftRadius: containerRadius,
                                    borderBottomRightRadius: containerRadius
                                }
                            ]}>
                            {children}
                        </View>
                    </Animated.View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    panel: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 10,
        width: "90%"
    },
    panel_heading: {
        padding: 0,
        borderRadius: 10,
        color: "#333",
        backgroundColor: "#f5f5f5"
    },
    panel_title: {
        fontSize: 20,
        color: "#fff",
        paddingTop: 20,
        paddingRight: 35,
        paddingBottom: 20,
        paddingLeft: 35,
        fontWeight: "bold",
        backgroundColor: "#F45C6B",
        position: "relative"
    },
    heading: {
        lineHeight: 1,
        marginTop: 0,
        marginBottom: 0,
    },
    iconStyle: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "absolute",
        left: -20,
        top: 10,
        color: "#fff",
        backgroundColor: "#F45C6B",
        borderWidth: 5,
        borderColor: "#fff",
        fontSize: 15,
        width: 40,
        height: 40,
        lineHeight: 30,
        borderRadius: 50,
    },
    items: {
        overflow: 'hidden'
    },
    item: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16
    }
});
