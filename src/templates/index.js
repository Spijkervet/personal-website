import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import fetch from 'isomorphic-fetch'

import { Layout, PostCard, Pagination } from "../components/common";
import { MetaData } from "../components/common/meta";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faFacebook,
    faMedium,
    faInstagram,
    faGithub
} from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import * as Vibrant from "node-vibrant";

// import {Spotify} from 'node-spotify-api'

// var spotify = new Spotify({
//   id: '',
//   secret: ''
// });

/**
 * Main index page (home page)
 *
 * Loads all posts from Ghost and uses pagination to navigate through them.
 * The number of posts that should appear per page can be setup
 * in /utils/siteConfig.js under `postsPerPage`.
 *
 */

function isLight(color) {
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
        return true;
    } else {
        return false;
    }
}

class Index extends React.Component {
    // const Index = ({ data, location, pageContext }) => {

    constructor(props) {
        super(props);
        this.state = {
            colors: [],
            currentlyPlayingTrack: "",
            currentlyPlayingTrackImage: "",
            currentlyPlayingTrackAlbum: "",
            currentlyPlaying: false,
            tracks: []
        };
        this.getCurrentlyPlayingTrack();
    }

    getAllTracks() {
        fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=janewilde&api_key=${process.env.LASTFM_API_KEY}&format=json`,
            {
                method: "GET" // POST
            }
        )
            .then(res => res.json())
            .then(res => {
                var tracks = res.recenttracks.track
                // Vibrant.from(trackImage)
                //     .getPalette()
                //     .then(palette => {
                //         var color = palette.Vibrant.hex;
                //         var trackColor = isLight(color) ? "white" : "black";
                //         this.setState({
                //             currentlyPlayingTrackColor: trackColor,
                //             currentlyPlayingTrackBackgroundColor: color
                //         });
                //     })
                //     .catch(function(error) {
                //         console.log(
                //             "There has been a problem with your fetch operation: " +
                //                 error.message
                //         );
                //     });

                this.setState({
                    tracks: tracks
                });
            })
            .catch(e => {
            });
    }

    getCurrentlyPlayingTrack() {
        fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=janewilde&api_key=${process.env.LASTFM_API_KEY}&format=json`,
            {
                method: "GET" // POST
            }
        )
            .then(res => res.json())
            .then(res => {
                var trackName = res.recenttracks.track[0].name;
                var trackImage = res.recenttracks.track[0].image[2]["#text"];
                var trackArtist = res.recenttracks.track[0].artist["#text"];
                var trackAlbum = res.recenttracks.track[0].album["#text"];
                console.log(res.recenttracks.track[0]);

                Vibrant.from(trackImage)
                    .getPalette()
                    .then(palette => {
                        var color = palette.Vibrant.hex;
                        var trackColor = isLight(color) ? "white" : "black";
                        this.setState({
                            currentlyPlayingTrackColor: trackColor,
                            currentlyPlayingTrackBackgroundColor: color
                        });
                    })
                    .catch(function(error) {
                        console.log(
                            "There has been a problem with your fetch operation: " +
                                error.message
                        );
                    });

                this.setState({
                    currentlyPlayingTrack: trackName,
                    currentlyPlayingTrackImage: trackImage,
                    currentlyPlayingTrackArtist: trackArtist,
                    currentlyPlayingTrackAlbum: trackAlbum,
                    currentlyPlaying: true
                });
            })
            .catch(e => {
                this.setState({
                    currentlyPlayingTrack: "-"
                });
            });
    }

    renderSwatches = () => {
        const { colors } = this.state;

        return colors.map((color, id) => {
            return (
                <div
                    key={id}
                    style={{
                        backgroundColor: color,
                        width: 100,
                        height: 100
                    }}
                />
            );
        });
    };

    getColors = colors =>
        this.setState(state => ({ colors: [...state.colors, ...colors] }));

    render() {
        const { data, location, pageContext } = this.props;
        const posts = data.allGhostPost.edges;

        const SpotifyTrack = (
            <>
                <span>I am currently listening this track on Spotify:</span>
                <div
                    className="grid-x spotify-track"
                    data-equalizer
                    style={{
                        backgroundColor: this.state
                            .currentlyPlayingTrackBackgroundColor
                    }}
                >
                    <div
                        className="cell small-4 spotify-image text-left"
                        data-equalizer-watch
                    >
                        <div
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(0,0,0,0) 30%, " +
                                    this.state
                                        .currentlyPlayingTrackBackgroundColor +
                                    " 100%)",
                                position: "absolute",
                                top: 0,
                                width: "inherit",
                                height: "100%"
                            }}
                        ></div>
                        <img src={this.state.currentlyPlayingTrackImage} />
                    </div>
                    <div
                        className="cell small-8 text-left track-text"
                        data-equalizer-watch
                        style={{
                            color: this.state.currentlyPlayingTrackColor
                        }}
                    >
                        <div className="track">
                            {this.state.currentlyPlayingTrack}
                        </div>
                        <div className="artist">
                            <span>{this.state.currentlyPlayingTrackAlbum}</span>
                            <span> - </span>
                            <span>
                                {this.state.currentlyPlayingTrackArtist}
                            </span>
                        </div>
                    </div>
                </div>
            </>
        );

        return (
            <>
                {/* 
            
                <div className="container">
                    <section className="post-feed">
                        {posts.map(({ node }) => (
                            // The tag below includes the markup for each post - components/common/PostCard.js
                            <PostCard key={node.id} post={node} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </div>
            </Layout> */}

                <MetaData location={location} />

                {/* <Container> */}
                <Layout isHome={true}>
                    <div className="grid-x text-center site-titles intro-text">
                        <div className="cell large-4"></div>
                        <div className="cell large-4">
                            <p>
                                I am a music producer, programmer and
                                occassional ethical hacker from Amsterdam. I am
                                currently pursuing a Master's Degree in
                                Artificial Intelligence at the University of
                                Amsterdam. My research interests include the
                                creative interaction between human and machine,
                                involuntary musical imagery, music generation
                                and recommender systems.
                            </p>
                            <p></p>
                            <div className="about-section">
                                <p>
                                    Currently working on my Master Thesis{" "}
                                    <a rel="noreferrer" href="https://uva.nl">
                                        @UniversityOfAmsterdam
                                    </a>{" "}
                                    in the field of Music Information Retrieval
                                </p>
                            </div>
                            <div className="spotify-section">
                                {this.state.currentlyPlaying ? 
                                SpotifyTrack
                                 : ''
                                }
                            </div>
                            <div>
                                <p className="email">
                                    janne.spijkervet [at] gmail [dot] com
                                </p>
                                <a
                                    rel="noreferrer"
                                    target="_top"
                                    href="mailto:janne.spijkervet@gmail.com?subject=Hello!"
                                >
                                    <div className="button contact-button">
                                        Say Hello!
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="cell large-4"></div>
                    </div>
                    {/* <TwitterTimelineEmbed
                    sourceType="profile"
                    screenName="spijkervet"
                    options={{ height: 200 }}
                /> */}
                    <div className="grid-x text-center site-titles">
                        <div className="cell">
                            <div className="social-buttons">
                                <a
                                    rel="noreferrer"
                                    href="https://twitter.com/spijkervet"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>

                                <a
                                    rel="noreferrer"
                                    href="https://github.com/spijkervet"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>

                                <a
                                    rel="noreferrer"
                                    href="https://facebook.com/janne.spijkervet"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>

                                <a
                                    rel="noreferrer"
                                    href="https://instagram.com/jannespijkervet"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>

                                <a
                                    rel="noreferrer"
                                    href="https://medium.com/@janne.spijkervet"
                                    target="_blank"
                                >
                                    <FontAwesomeIcon icon={faMedium} />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* <div className="grid-x">
                    <div className="cell small-12 large-3 name-section">
                        <div className="about-titles">
                            <h1>Songwriter.</h1>
                            <h1>Music Producer.</h1>
                            <h1>MSc AI Student.</h1>
                        </div>
                    </div>

                            <div className="cell large-6 small-12">
                                <h2>Education</h2>
                                <ul className="fa-ul">
                                    <li>
                                        <div className="description">
                                            <p className="course">
                                                MSc in Artificial Intelligence,
                                                2020
                                            </p>
                                            <p className="institution">
                                                University of Amsterdam
                                            </p>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="description">
                                            <p className="course">
                                                BMus in Music Technology,
                                                Composition and Production, 2018
                                            </p>
                                            <p className="institution">
                                                HKU University of the Arts
                                                Utrecht
                                            </p>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="description">
                                            <p className="course">
                                                Sweelinck Academy for Young
                                                Talents, 2013
                                            </p>
                                            <p className="institution">
                                                Conservatory of Amsterdam
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}
                    {/* </Container> */}
                    <section className="post-feed">
                        {posts.map(({ node }) => (
                            // The tag below includes the markup for each post - components/common/PostCard.js
                            <PostCard key={node.id} post={node} />
                        ))}
                    </section>
                    <Pagination pageContext={pageContext} />
                </Layout>

                {/* <Container>
          <h1 id="opensource">Open Source</h1>
          <Row className='grid-row'>
            <Col md={3} xs={12}>
              <GithubCard title="homelab" description="My Homelab built on Docker" language="Dockerfile" stars="...." forks="..." />
            </Col>

            <Col md={3} xs={12}>
            <GithubCard title="dotfiles" description="My dotfiles" language="Perl" stars="...." forks="..." />
            </Col>

            <Col md={3} xs={12}>
            <GithubCard title="midi_controller" description="MIDI controller made with React and Flask, for use with Ableton or other DAWs" language="JavaScript" stars="...." forks="..." />
            </Col>
            <Col md={3} xs={12}>
              <GithubCard title="..." stars="...." forks="..." />
            </Col>
          </Row>
        </Container> */}

                {/* <Container>
                <h1 id="courses">Courses</h1>
                <Row className="grid-row">
                    <Col mb={3}>
                        <Card
                            course="How Music Works: Cognitive and Computational Perspectives"
                            institution="University of Amsterdam"
                            grade=""
                        />
                    </Col>

                    <Col mb={3}>
                        <Card
                            course="Information Retrieval 2"
                            institution="University of Amsterdam"
                            grade=""
                        />
                    </Col>

                    <Col mb={3}>
                        <Card
                            course="Machine Learning 1"
                            institution="University of Amsterdam"
                            grade="8.0"
                        />
                    </Col>
                    <Col mb={3}>
                        <Card
                            course="Deep Learning"
                            institution="University of Amsterdam"
                            grade="7.5"
                        />
                    </Col>
                </Row>

                <Row className="grid-row">
                    <Col mb={3}>
                        <Card
                            course="Natural Language Processing 2"
                            institution="University of Amsterdam"
                            grade="9.0"
                        />
                    </Col>
                    <Col mb={3}>
                        <Card
                            course="Computer Vision 1"
                            institution="University of Amsterdam"
                            grade="8.0"
                        />
                    </Col>

                    <Col mb={3}>
                        <Card
                            course="Project AI"
                            institution="University of Amsterdam"
                            grade="8.5"
                        />
                    </Col>

                    <Col mb={3}>
                        <Card
                            course=" Data Mining Techniques"
                            institution="University of Amsterdam"
                            grade="8.0"
                        />
                    </Col>
                </Row>

                <Row className="grid-row">
                    <Col mb={3}>
                        <Card
                            course="Information Retrieval 1"
                            institution="University of Amsterdam"
                            grade="7.0"
                        />
                    </Col>
                    <Col mb={3}>
                        <Card
                            course="Evolutionary Computing"
                            institution="Vrije Universiteit Amsterdam"
                            grade="8.5"
                        />
                    </Col>

                    <Col mb={3}>
                        <Card
                            course="Knowledge Representation"
                            institution="Vrije Universiteit Amsterdam"
                            grade="7.5"
                        />
                    </Col>

                    <Col mb={3}>
                        <Card
                            course="Natural Language Processing 1"
                            institution="University of Amsterdam"
                            grade="7.0"
                        />
                    </Col>
                </Row>

                <Row>
                    <Col mb={3}>
                        <Card
                            course="Multi-Agent Systems"
                            institution="Vrije Universiteit Amsterdam"
                            grade="7.0"
                        />
                    </Col>
                </Row>
            </Container> */}
            </>
        );
    }
}

Index.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired,
    pageContext: PropTypes.object,
    currentlyPlayingTrack: PropTypes.string
};

export default Index;

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination
export const pageQuery = graphql`
    query GhostPostQuery($limit: Int!, $skip: Int!) {
        allGhostPost(
            sort: { order: DESC, fields: [published_at] }
            limit: $limit
            skip: $skip
        ) {
            edges {
                node {
                    ...GhostPostFields
                }
            }
        }
    }
`;
