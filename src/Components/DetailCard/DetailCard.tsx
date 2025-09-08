import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface IDetailCardsProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailCard: React.FC<IDetailCardsProps> = ({ icon, label, value }) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box sx={{ color: "primary.main", margin: 2 }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{label}</Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: 600, color: "secondary.main" }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailCard;
