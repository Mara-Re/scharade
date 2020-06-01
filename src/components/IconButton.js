import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from '@material-ui/core/styles';

const BorderedIconButton = withStyles({
    root: {
        border: '#eeeeee 2px solid'
    }
})(IconButton);

export default BorderedIconButton;