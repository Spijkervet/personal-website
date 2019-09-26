import React from "react"

import ColorThief from "colorthief"


class SpotifyWidget extends React.Component {
    constructor(props) {
        super(props);
        this.imgRef = React.createRef();

        this.state = {
            backgroundColor: "white"
        };
    }

    componentDidMount() {}

    isLight(color) {
        // Check the format of the color, HEX or RGB?
        var r,
            g,
            b,
            hsp = 0;
        if (color.match(/^rgb/)) {
            // If HEX --> store the red, green, blue values in separate variables
            color = color.match(
                /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
            );

            var r = color[1];
            var g = color[2];
            var b = color[3];
        } else {
            // If RGB --> Convert it to HEX: http://gist.github.com/983661
            color = +(
                "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
            );

            var r = color >> 16;
            var g = (color >> 8) & 255;
            var b = color & 255;
        }

        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

        // Using the HSP value, determine whether the color is light or dark
        if (hsp > 126.5) {
            return "black";
        } else {
            return "white";
        }
    }

    render() {
        var trackImage = (
            <img
                crossOrigin={"anonymous"}
                src={this.props.trackImage}
                ref={this.imgRef}
                alt={this.props.trackName}
                onLoad={() => {
                    const colorThief = new ColorThief();
                    const img = this.imgRef.current;
                    const result = colorThief.getColor(img, 25);
                    const rgb = "rgb(" + result.join(", ") + ")";
                    this.setState({
                        backgroundColor: rgb,
                        color: this.isLight(rgb)
                    });
                }}
            />
        );
        // var color = colorThief.getColor(trackImage);
        // console.log('colorrr ' + color)

        return (
            <>
                <a
                    className="cell large-3 small-12 grid-x spotify-track"
                    data-equalizer
                    style={{
                        backgroundColor: this.state.backgroundColor
                    }}
                    href={this.props.trackLink}
                    rel="noreferrer"
                    target="_blank"
                >
                    <div
                        className="cell small-4 spotify-image text-left"
                        data-equalizer-watch
                    >
                        <div
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(0,0,0,0) 30%, " +
                                    this.state.backgroundColor +
                                    " 100%)",
                                position: "absolute",
                                top: 0,
                                width: "inherit",
                                height: "100%"
                            }}
                        ></div>
                        {trackImage}
                    </div>
                    <div
                        className="cell small-8 text-left track-text"
                        data-equalizer-watch
                        style={{
                            color: this.state.color
                        }}
                    >
                        <div className="track">{this.props.trackName}</div>
                        <div className="artist">
                            <span>{this.props.trackAlbum}</span>
                            <span> - </span>
                            <span>{this.props.trackArtist}</span>
                        </div>
                    </div>
                </a>
            </>
        );
    }
}

export default SpotifyWidget;