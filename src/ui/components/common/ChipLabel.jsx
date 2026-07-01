import {
    Chip,
    Box
} from "@mui/material";
import { TYPES_CHIPS } from "./../../../theme/variables";

export default function ChipLabel ({ 
    typeChip, chip,
    size = "small",
    subLabel = false
}) {

    const map = TYPES_CHIPS[typeChip];
    const styleConfig = map[chip];

    return (
        <>
            <Chip
                component="span"
                size={size}
                label={subLabel ? styleConfig.subLabel : styleConfig.label}
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