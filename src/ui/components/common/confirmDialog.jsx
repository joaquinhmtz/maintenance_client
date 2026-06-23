import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Slide,
    Button
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDialog({
    open, handleConfirmClose, handleClose,
    title, description, sizeModal = "xs",
    textConfirm, textCancel
}) {

    return (
        <>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={sizeModal}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                role="alertdialog"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText 
                        id="alert-dialog-slide-description"
                        sx={{ whiteSpace: "pre-line" }}
                    >
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleConfirmClose} autoFocus>
                        {textCancel}
                    </Button>
                    <Button 
                        color='error'
                        onClick={handleClose} autoFocus>
                        {textConfirm}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}