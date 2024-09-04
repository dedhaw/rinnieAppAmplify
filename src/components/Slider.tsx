import React from "react";
import styled from "styled-components";

interface SliderProps {
  color: string;
}

interface SliderState {
  value: number;
}

const sliderThumbStyles = (props: SliderProps & { opacity: number }) => `
  width: 30px; /* Increased thumb size */
  height: 30px; /* Increased thumb size */
  background: ${props.color};
  cursor: pointer;
  outline: 5px solid #333;
  opacity: ${props.opacity};
  -webkit-transition: .2s;
  transition: opacity .2s;
`;

const Styles = styled.div<{ opacity: number; color: string }>`
  display: flex;
  align-items: center;
  color: #888;
  margin-top: 2rem;
  margin-bottom: 2rem;

  .value {
    flex: 1;
    font-size: 2rem;
  }

  .slider {
    flex: 6;
    -webkit-appearance: none;
    width: 100%;
    height: 20px; /* Increased track height */
    border-radius: 10px; /* Adjusted for visual balance */
    background: #efefef;
    outline: none;

    &::-webkit-slider-runnable-track {
      height: 20px; /* Match track height */
      border-radius: 10px; /* Adjusted for visual balance */
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      ${(props) => sliderThumbStyles(props)}
    }

    &::-moz-range-track {
      height: 20px; /* Match track height */
      border-radius: 10px; /* Adjusted for visual balance */
      background: #efefef;
    }

    &::-moz-range-thumb {
      ${(props) => sliderThumbStyles(props)}
    }

    &::-ms-track {
      height: 20px; /* Match track height */
      border-radius: 10px; /* Adjusted for visual balance */
      background: transparent; /* Hide the track */
      border-color: transparent;
      color: transparent;
    }

    &::-ms-fill-lower,
    &::-ms-fill-upper {
      background: #efefef;
      border-radius: 10px; /* Adjusted for visual balance */
    }

    &::-ms-thumb {
      ${(props) => sliderThumbStyles(props)}
    }
  }
`;

export default class Slider extends React.Component<SliderProps, SliderState> {
  state: SliderState = {
    value: 50,
  };

  handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: parseInt(e.target.value) });
  };

  render() {
    return (
      <Styles
        opacity={this.state.value > 10 ? this.state.value / 255 : 0.1}
        color={this.props.color}
      >
        <input
          type="range"
          min={0}
          max={255}
          value={this.state.value}
          className="slider"
          onChange={this.handleOnChange}
        />
        <div className="value">{this.state.value}</div>
      </Styles>
    );
  }
}
