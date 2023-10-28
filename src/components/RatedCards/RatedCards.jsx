import React from 'react';
import { Typography, Box } from '@mui/material';
import { Movie } from '..';

import useStyles from './styles';

const RatedCards = ({ data, title}) => {
    const classes = useStyles();

    return (
        <Box>
            <Typography variant='h5' gutterBottom marginTop='10px'>{title}</Typography>
            <Box display='flex' flexWrap='wrap' className={classes.container}>
                {data?.results.map((movie, i) => (
                    <Movie key={movie.id} movie={movie} i={i} />
                ))}
            </Box>
        </Box>
    )
};

export default RatedCards;