import React from "react";
import { Link } from "gatsby";
import { Layout } from "../components/common";

import SpotifyWidget from "../components/SpotifyWidget";

class Music extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentlyPlaying: false
        };

        this.getTracks(100);
    }

    getTracks(limit) {
        fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=janewilde&api_key=00ed4e34d5b3eb0a163d73e4778b2ce4&format=json`,
            {
                method: "GET" // POST
            }
        )
            .then(res => res.json())
            .then(res => {
                var tmpState = [];
                var tracks = res.recenttracks.track;
                for (var i = 0; i < tracks.length; i++) {
                    if (i == limit) {
                        break;
                    }
                    tmpState.push(
                        <SpotifyWidget
                            key={i}
                            trackName={tracks[i].name}
                            trackAlbum={tracks[i].album["#text"]}
                            trackArtist={tracks[i].artist["#text"]}
                            trackImage={tracks[i].image[2]["#text"]}
                            trackLink={tracks[i].url}
                        />
                    );
                }

                this.setState({
                    currentlyPlayingTrack: tmpState,
                    currentlyPlaying: true
                });
            })
            .catch(e => {
                console.log(e);
                this.setState({
                    currentlyPlayingTrack: "-"
                });
            });
    }

    render() {
        return (
            <Layout>
                <div class="grid-container music-container">
                    <div className="grid-x text-center site-titles intro-text">
                        <div className="cell large-4"></div>
                        <div className="cell large-4">
                            <h1>My Music Timeline</h1>
                            <p>
                                This is a live history of all the (digital)
                                music I listen to.
                            </p>
                        </div>
                        <div className="cell large-4"></div>
                    </div>

                    <div className="grid-x grid-margin-x spotify-section">
                        {this.state.currentlyPlaying
                            ? this.state.currentlyPlayingTrack
                            : ""}
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Music;
