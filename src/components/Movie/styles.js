import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
    movie: {
        padding: '10px',
    },
    links: {
        alignItems: 'center',
        fontWeight: 'bolder',
        textDecoration: 'none',
        [theme.breakpoints.up('xs')]: {
            display: 'flex',
            flexDirection: 'column',
        },
        '&:hover': {
            cursor: 'pointer',
        }
    },
    image: {
        borderRadius: '20px',
        height: '300px',
        marginBottom: '16px',
        '&:hover': {
            transform: 'scale(1.05)',
            transition: 'all ease-in-out 0.3s'
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '400px',
        },
    },
    title: {
        color: theme.palette.text.primary,
        textOverflow: 'ellipsis',
        width: '230px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        marginTop: '10px',
        marginBottom: 0,
        textAlign: 'center',
    },
}));