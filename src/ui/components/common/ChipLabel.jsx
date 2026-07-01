import {
    Chip,
    Box
} from "@mui/material";
import { TYPES_CHIPS } from "./../../../theme/variables";

export default function ChipLabel ({ 
    typeChip, chip,
    size = "small"
}) {

    // const map = {
    //     Alta: { bgcolor: C.dangerBg, color: C.dangerText, dot: C.danger },
    //     Media: { bgcolor: C.warningBg, color: C.warningText, dot: C.warning },
    //     Baja: { bgcolor: C.successBg, color: C.successText, dot: C.success },
    // };
    const map = TYPES_CHIPS[typeChip];
    const styleConfig = map[chip];

    return (
        <>
            <Chip
                component="span"
                size={size}
                label={styleConfig.label}
                icon={styleConfig.dot && (
                    <Box
                        component="span"
                        sx={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: "60%", 
                            bgcolor: styleConfig.dot, 
                            ml: "6px !important" 
                        }}
                    />
                )}
                sx={{ 
                    bgcolor: styleConfig.bgcolor, color: styleConfig.color, 
                    fontWeight: 600, fontSize: 11
                }}
            />
        </>
    )
}