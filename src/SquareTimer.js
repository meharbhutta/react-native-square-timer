'use strict';

import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, ViewPropTypes } from 'react-native';

const ViewPropTypesStyle = ViewPropTypes ? ViewPropTypes.style : View.propTypes.style;

export default class SquareTime extends React.Component {

  static propTypes = {
    min: PropTypes.number.isRequired,
    length: PropTypes.number,
    borderWidth: PropTypes.number,
    elapsedIndicatorColor: PropTypes.string,
    remainingIndicatorColor: PropTypes.string,
    innerSqaureColor: PropTypes.string,
    style: ViewPropTypesStyle,
    textStyle: Text.propTypes.style,
    onTimeElapsed: PropTypes.func
  };

  static defaultProps = {
    length: 200,
    borderWidth: 20,
    elapsedIndicatorColor: "#818181",
    innerSqaureColor: "#ffffff",
    remainingIndicatorColor: null,
    style: null,
    textStyle: null,
    onTimeElapsed: () => {}
  };

  __initialState = (min, halfLength, borderWidth) => ({
    translateThreshold: halfLength - borderWidth,
    translateInc: halfLength / ((min * 60) / 8),
    cover: 0,
    translate: 0,
    rotate: 0,
    remainingTime: min * 60
  });

  constructor(props) {
    super(props);

    this.state = this.__initialState(
      props.min, 
      props.length / 2, 
      props.borderWidth
    );

    this.__styles = __staticStyles(
      props.length, 
      props.borderWidth, 
      props.elapsedIndicatorColor, 
      props.remainingIndicatorColor,
      props.innerSqaureColor
    );
  }

  componentDidMount() {
    this.__setTimer();
  }

  __setTimer = () => {
    this.__timer = setInterval(() => {
      const { 
        borderWidth,
        onTimeElapsed 
      } = this.props, { 
        translateThreshold,
        translateInc,
        remainingTime: previousTime, 
        translate: previousTranslate,
        rotate: previousRotate,
        cover: previousCover
      } = this.state,
        remainingTime = previousTime - 1;

      let cover = previousCover, 
        translate = 0, 
        rotate = 0,
        rotateInc = (45 * translateInc) / borderWidth; 

      if ((previousCover - 1) % 3 === 0) {
        const rotateCheck = previousRotate + rotateInc;
        if (rotateCheck >= 90) {
          const translateCheck = rotateCheck - 90;
          if (translateCheck > 0) translate = rotateInc / translateInc;
          cover = previousCover + 1;
        } else rotate = rotateCheck;
      } else {
        const translateCheck = previousTranslate + translateInc;
        if (translateCheck >= translateThreshold) {
          const rotateCheck = translateCheck - translateThreshold;
          if (rotateCheck > 0) rotate = translateInc / rotateInc;
          cover = previousCover + 1;
        } else translate = translateCheck;
      }

      this.setState({
          remainingTime,
          translate,
          rotate,
          cover
        }, () => {
          if (remainingTime === 0) {
            clearInterval(this.__timer);
            onTimeElapsed();
          }
        }
      );
    }, 1000);
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps &&
      this.props &&
      prevProps.min &&
      this.props.min &&
      (prevProps.min !== this.props.min)
    ) this.__reset();
  }

  __reset = () => {
    const {
      min,
      borderWidth,
      length
    } = this.props;
    
    if (this.__timer) clearInterval(this.__timer);
    this.__setTimer();
    this.setState(
      this.__initialState(
        min, 
        length / 2, 
        borderWidth
      )
    );
  }

  componentWillUnmount() {
    if (this.__timer) clearInterval(this.__timer);
  }

  render() {
    const {
      borderWidth,
      style,
      textStyle
    } = this.props, { 
      cover, 
      remainingTime, 
      translate,
      rotate
    } = this.state,
      remainingMin = Math.ceil(remainingTime / 60);

    return (
      <View
        style={{
          ...style,
          ...this.__styles.FIXED_VIEW
        }}
      >
        <View
          style={{
            ...this.__styles.BASE_SQAURE,
            ...this.__styles.RT,
            ...__dynamicRT(
              cover,
              translate,
              borderWidth,
              elapsedIndicatorColor,
              remainingIndicatorColor
            ).style
          }}
        />
        {cover < 2 && (
          <View
            style={{
              ...this.__styles.BASE_SQAURE,
              ...this.__styles.CORNER_RT,
              ...__dynamicRotate(
                rotate
              ).style
            }}
          >
            <View
              style={{
                ...this.__styles.BASE_SQAURE,
                ...this.__styles.CORNER_RT_S
              }}
            />
          </View>
        )}
        {cover < 6 && (
          <View
            style={{
              ...this.__styles.BASE_SQAURE,
              ...this.__styles.RB,
              ...__dynamicRB(
                cover,
                translate,
                borderWidth
              ).style
            }}
          />
        )}
        {cover < 5 && (
          <View
            style={{
              ...this.__styles.BASE_SQAURE,
              ...this.__styles.CORNER_RB,
              ...__dynamicRotate(
                rotate
              ).style
            }}
          >
            <View
              style={{
                ...this.__styles.BASE_SQAURE,
                ...this.__styles.CORNER_RB_S
              }}
            />
          </View>
        )}
        {cover < 9 && (
          <View
            style={{
              ...this.__styles.BASE_SQAURE,
              ...this.__styles.LB,
              ...__dynamicLB(
                cover,
                translate,
                borderWidth
              ).style
            }}
          />
        )}
        {cover < 8 && (
          <View
            style={{
              ...this.__styles.BASE_SQAURE,
              ...this.__styles.CORNER_LB,
              ...__dynamicRotate(
                rotate
              ).style
            }}
          >
            <View
              style={{
                ...this.__styles.BASE_SQAURE,
                ...this.__styles.CORNER_LB_S
              }}
            />
          </View>
        )}
        {cover < 12 && (
          <View
            style={{
              ...this.__styles.BASE_SQAURE,
              ...this.__styles.LT,
              ...__dynamicLT(
                cover,
                translate,
                borderWidth
              ).style
            }}
          />
        )}
        {cover < 11 && (
          <View
            style={{
              ...this.__styles.BASE_SQAURE,
              ...this.__styles.CORNER_LT,
              ...__dynamicRotate(
                rotate
              ).style
            }}
          >
            <View
              style={{
                ...this.__styles.BASE_SQAURE,
                ...this.__styles.CORNER_LT_S
              }}
            />
          </View>
        )}
        <View
          style={this.__styles.INNER_SQAURE}
        >
          <Text
            style={{
              ...this.__styles.TEXT,
              ...textStyle
            }}
          >
            {remainingMin}
          </Text>
        </View>
      </View>
    );
  }
}

const __dynamicRT = (
  cover,
  translate,
  borderWidth,
  elapsedIndicatorColor,
  remainingIndicatorColor
) => StyleSheet.create({
  style: {
    backgroundColor: (cover > 2 ? elapsedIndicatorColor : (remainingIndicatorColor ? remainingIndicatorColor : "brown")),
    zIndex:  (cover > 6 ? 5 : 1),
    transform: [{ 
      translateX: cover === 0 ? translate : 0 
    }, { 
      translateY: (cover === 1 || cover === 2) ? borderWidth + translate : 0 
    }]
  }
});

const __dynamicRB = (
  cover,
  translate,
  borderWidth
) => StyleSheet.create({
  style: {
    transform: [{ 
      translateX: (cover === 4 || cover === 5) ? -(borderWidth + translate) : 0 
    }, { 
      translateY: cover === 3 ? translate : 0 
    }]
  }
});

const __dynamicLB = (
  cover,
  translate,
  borderWidth
) => StyleSheet.create({
  style: {
    transform: [{ 
      translateX: cover === 6 ? -translate : 0 
    }, { 
      translateY: (cover === 7 || cover === 8) ? -(borderWidth + translate) : 0 
    }]
  }
});

const __dynamicLT = (
  cover,
  translate,
  borderWidth
) => StyleSheet.create({
  style: {
    transform: [{ 
      translateX: (cover === 10 || cover === 11) ? borderWidth + translate : 0 
    }, { 
      translateY: cover === 9 ? -translate : 0 
    }],
  }
});

const __dynamicRotate = (
  rotate
) => StyleSheet.create({
  style: {
    transform: [{ 
      rotateZ: `${rotate}deg` 
    }]
  }
});

const __staticStyles = (
  length, 
  borderWidth, 
  elapsedIndicatorColor,
  remainingIndicatorColor,
  innerSqaureColor
) => StyleSheet.create({
  FIXED_VIEW: {
    width: length,
    height: length,
    backgroundColor: elapsedIndicatorColor,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  INNER_SQAURE: {
    width: length - (borderWidth * 2),
    height: length - (borderWidth * 2),
    backgroundColor: innerSqaureColor,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 5
  },
  BASE_SQAURE: {
    width: "50%",
    height: "50%",
    position: "absolute",
  },
  RT: {
    right: 0,
    top: 0,
  },
  CORNER_RT: {
    right: -((length / 4) - borderWidth),
    top: -((length / 4) - borderWidth),
    backgroundColor: "transparent",
    zIndex: 2,
  },
  CORNER_RT_S: {    
    backgroundColor: remainingIndicatorColor ? remainingIndicatorColor : "brown",
    right: 0,
    top: 0,
  },
  RB: {
    backgroundColor: remainingIndicatorColor ? remainingIndicatorColor :  "red",
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  CORNER_RB: {
    right: -((length / 4) - borderWidth),
    bottom: -((length / 4) - borderWidth),
    backgroundColor: "transparent",
    zIndex: 3,
  },
  CORNER_RB_S: { 
    backgroundColor: remainingIndicatorColor ? remainingIndicatorColor : "red",
    right: 0,
    bottom: 0,
  },
  LB: {  
    backgroundColor: remainingIndicatorColor ? remainingIndicatorColor : "green",
    left: 0,
    bottom: 0,
    zIndex: 3,
  },
  CORNER_LB: {
    left: -((length / 4) - borderWidth),
    bottom: -((length / 4) - borderWidth),
    backgroundColor: "transparent",
    zIndex: 3,
  },
  CORNER_LB_S: {
    backgroundColor: remainingIndicatorColor ? remainingIndicatorColor : "green",
    left: 0,
    bottom: 0,
  },
  LT: {
    backgroundColor: remainingIndicatorColor ? remainingIndicatorColor : "orange",
    left: 0,
    top: 0,
    zIndex: 4,
  },
  CORNER_LT: {
    left: -((length / 4) - borderWidth),
    top: -((length / 4) - borderWidth),
    backgroundColor: "transparent",
    zIndex: 3,
  },
  CORNER_LT_S: {
    backgroundColor: remainingIndicatorColor ? remainingIndicatorColor : "orange",
    left: 0,
    top: 0
  },
  TEXT: {
    fontSize: 32,
    lineHeight: 36,
    color: "#000000"
  }
})
