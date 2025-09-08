import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button, { CloseButton } from "Components/Button";
import DetailCard from "Components/DetailCard";
import { User } from "redux/auth/user.model";

interface IProfileCardProps {
  cardTitle?: string;
  userName?: string;
  handleClose?: React.MouseEventHandler<HTMLButtonElement>;
  userDetails?: User;
}

const ProfileCard: React.FC<IProfileCardProps> = ({
  cardTitle = "Profile",
  userName = "user",
  handleClose,
  userDetails = { phone: "", email: "" },
}) => {
  const { phone = "", email = "" } = userDetails;

  return (
    <Box sx={{ padding: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: 18, fontWeight: 700, color: "secondary.main" }}
          aria-label={`${cardTitle} Title`}
        >
          {cardTitle}
        </Typography>
        {handleClose && <CloseButton onClick={handleClose} />}
      </Box>
      <Divider sx={{ marginBlock: 2 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: "secondary.main",
            marginTop: 2,
          }}
          aria-label={`User Name: ${userName}`}
        >
          {userName}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          Role: Administrator
        </Typography>
      </Box>

      <Divider sx={{ marginBlock: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DetailCard
          icon={<PhoneOutlinedIcon />}
          label="Mobile number"
          value={phone}
          aria-label={`Mobile number: ${phone}`}
        />
        <DetailCard
          icon={<EmailOutlinedIcon />}
          label="Email address"
          value={email}
          aria-label={`Email: ${email}`}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBlockStart: 4,
        }}
      >
        <Button sx={{ width: "30%" }} variant="contained" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCard;
