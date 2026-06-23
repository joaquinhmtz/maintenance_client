import {
    Card,
    CardContent,
    Skeleton,
    Box
} from "@mui/material";

export default function SkeletonTable({ rows = 10 }) {
    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 2fr 4fr 2fr 1fr",
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                </Box>

                {Array.from({ length: rows }).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "2fr 2fr 4fr 2fr 1fr",
                            gap: 2,
                            alignItems: "center",
                            mb: 1.5
                        }}
                    >
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={30}  />
                        <Skeleton variant="text" height={30} />
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}