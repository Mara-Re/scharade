// import React from 'react';
// import CardContent from "@material-ui/core/CardContent";
// import Box from "@material-ui/core/Box";
// import Typography from "@material-ui/core/Typography";
// import Card from "@material-ui/core/Card";
// import { makeStyles } from '@material-ui/core/styles';
//
//
//
// const useStyles = makeStyles({
//     root: {
//         // minWidth: 275,
//         // maxWidth: 500,
//         // margin: '30px 0'
//     }
// });
//
//
// const Header = (props) => {
//     const {
//         children,
//     } = props;
//
//     const classes = useStyles();
//     return (
//         <Box display='flex' justifyContent='center' alignSelf="center">
//             <Card className={classes.root}>
//                 <CardContent>
//                     <Box display="flex" justifyContent='space-between'>
//                         <Box alignSelf="center">
//                             <Typography variant="h4">
//                                 {children}
//                             </Typography>
//                             <Box display='flex' flexDirection='column' alignSelf="center">
//                                 <TimerIcon />
//                             </Box>
//                         </Box>
//                     </Box>
//                 </CardContent>
//             </Card>
//         </Box>
//
//     );
// }
//
// export default Header;