import React, { useEffect, useState } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, useMediaQuery, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import useStyles from './styles';
import { useGetMovieQuery, useGetRecommendationsQuery, useGetListQuery } from '../../services/TMDB';
import genreIcons from '../../assets/genres';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { MovieList, Pagination } from '..';
import { userSelector } from '../../features/auth';


const MovieInformation = () => {
    const { user } = useSelector(userSelector);
    const [page, setPage] = useState(1);
    const classes = useStyles();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    // console.log(data);
    
    const [isMovieFavorited, setIsMovieFavorited] = useState(false);
    const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);
    
    const { data, isFetching, error } = useGetMovieQuery(id);
    const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({list: '/recommendations', movie_id: id, page: page});
    const { data: favoriteMovies } = useGetListQuery({listName: '/favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: page});
    const { data: watchlistMovies } = useGetListQuery({listName: '/watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: page});
    // console.log(recommendations);

    useEffect(() => {
        setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
    }, [favoriteMovies, data]);

    useEffect(() => {
        setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
    }, [watchlistMovies, data]);

    const addToFavorites = async () => {
        await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
            media_type: 'movie',
            media_id: id,
            favorite: !isMovieFavorited,
        });

        setIsMovieFavorited((prev) => !prev);
    };

    const addToWatchlist = async () => {
        await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
            media_type: 'movie',
            media_id: id,
            watchlist: !isMovieWatchlisted,
        });

        setIsMovieWatchlisted((prev) => !prev);
    };

    if (isFetching) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress size='8rem' />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center'>
                <Link to='/'>Something has gone wrong! - Go back</Link>
            </Box>
        );
    }

    return (
        <Grid container className={classes.containerSpaceAround}>
            <Grid item sm={12} lg={4} style={{display: 'flex', marginBottom: '30px'}}>
                <img 
                    className={classes.poster}
                    src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
                    title={data?.title}
                />
            </Grid>
            <Grid item container direction='column' lg={7}>
                <Typography variant='h4' align='center' gutterBottom>
                    {data?.title} ({data?.release_date.split('-')[0]})
                </Typography>
                <Typography variant='h5' align='center' gutterBottom>
                    {data?.tagline}
                </Typography>
                <Grid item className={classes.containerSpaceAround}>
                    <Box display='flex' align='center'>
                        <Rating readOnly  precision={0.1} value={data?.vote_average / 2} />
                        <Typography variant='subtitle1' gutterBottom style={{marginLeft: '10px'}}>
                            {data?.vote_average.toFixed(1)} / 10
                        </Typography>
                    </Box>
                    <Typography variant='h6' align='center' gutterBottom >
                        {data?.runtime}min | Language: {data?.spoken_languages[0].name}
                    </Typography>
                </Grid>
                <Grid item className={classes.genresContainer}>
                    {data?.genres?.map((genre, i) => (
                        <Link key={genre?.name} to='/' className={classes.links} onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
                            <img src={genreIcons[genre?.name.toLowerCase()]} className={classes.genreImage} height={30} />
                            <Typography variant='subtitle1' color='textPrimary'>
                                {genre?.name}
                            </Typography>
                        </Link>
                    ))}
                </Grid>
                <Typography variant='h5' gutterBottom style={{ marginTop: '10px'}}>Overview</Typography>
                <Typography style={{ marginBottom: '2rem' }}>{data?.overview}</Typography>
                <Typography variant='h5' gutterBottom>Top Cast</Typography>
                <Grid item container spacing={2}>
                    {data && data.credits.cast.map((character, i) => (
                        character.profile_path && (
                            <Grid item key={i} xs={4} md={2} lg={3}  component={Link} to={`/actors/${character.id}`} style={{textDecoration:'none'}}>
                                <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500/${character?.profile_path}`} alt={character.name} />
                                <Typography color='textPrimary'>{character?.name}</Typography>
                                <Typography color='textScondary'>{character.character.split('/')[0]}</Typography>
                            </Grid>
                        )
                    )).slice(0, 4)}
                </Grid>
                <Grid item container style={{marginTop: '2rem'}}>
                    <div className={classes.buttonsContainer}>
                        <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                            <ButtonGroup sx={{orientation:{sm:'vertical'}}} variant='outlined' size='small'>
                                <Button target='_blank' rel='noopener noreferrer' href={data?.homepage} endIcon={<Language />}>Website</Button>
                                <Button target='_blank' rel='noopener noreferrer' href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>IMDB</Button>
                                <Button onClick={()=> setOpen(true)} href='#' endIcon={<Theaters />}>Trailer</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                            <ButtonGroup sx={{orientation:{sm:'vertical'}}}   variant='outlined' size='small'>
                                <Button onClick={addToFavorites} endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}>
                                    {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                                </Button>
                                <Button onClick={addToWatchlist} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>Watchlist</Button>
                                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                                    <Typography component={Link} to='/' color='inherit' variant='subtitle2' style={{textDecoration:'none'}}>Back</Typography>
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            <Box marginTop='5rem' width='100%'>
                <Typography variant='h3' gutterBottom align='center'>You might also like</Typography>
                { recommendations
                    ? <MovieList movies={recommendations} numberOfMovies={8} />
                    : <Box>Sorry, nothing was found.</Box>
                }
                <Pagination currentPage={page} setPage={setPage} totalPages={recommendations?.total_pages} />
            </Box>
            <Modal
                closeAfterTransition
                className={classes.modal}
                open={open}
                onClose={() => setOpen(false)}
            >
                {data?.videos?.results?.length > 0 && (
                    <iframe 
                        autoPlay
                        className={classes.videos}
                        frameBorder='0'
                        title='Trailer'
                        src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
                        allow='autoplay'
                    />
                )}
            </Modal>
        </Grid>
    );
};

export default MovieInformation;