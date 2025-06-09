import {
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createTransactionFailure,
  createTransactionStart,
  createTransactionSuccess,
} from "../store/slices/transactionSlice";
import type { RootState } from "../store/store";

interface Package {
  id: number;
  name: string;
  price: number;
  data: string;
  duration: string;
  description: string;
}

const Purchase: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/packages/${packageId}`
        );
        setPackageData(response.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil Data",
          text: "Gagal mengambil data paket",
        });
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageData || !user) return;

    dispatch(createTransactionStart());

    try {
      const response = await axios.post("http://localhost:3000/transactions", {
        userId: user.id,
        packageId: packageData.id,
        date: new Date().toISOString(),
        status: "completed",
        total: packageData.price,
      });

      dispatch(createTransactionSuccess(response.data));
      Swal.fire({
        icon: "success",
        title: "Pembelian Berhasil!",
        text: `Anda berhasil membeli ${packageData.name}.`,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate("/transactions");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Pembelian Gagal",
        text: "Terjadi kesalahan saat melakukan pembelian",
      });
      dispatch(createTransactionFailure("Gagal melakukan pembelian"));
    }
  };

  if (!packageData) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Memuat data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #f5f7fa 0%, #e4e8eb 100%)",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <Box sx={{ mt: 4 }}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  textAlign: "center",
                  mb: 3,
                }}
              >
                Konfirmasi Pembelian
              </Typography>

              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(33, 150, 243, 0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    mb: 2,
                  }}
                >
                  {packageData.name}
                </Typography>
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Rp {packageData.price.toLocaleString()}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 2,
                  }}
                >
                  {packageData.data} / {packageData.duration}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {packageData.description}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nomor Telepon"
                  variant="outlined"
                  margin="normal"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 5px 8px 2px rgba(33, 203, 243, .4)",
                    },
                  }}
                >
                  Konfirmasi Pembelian
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Batal
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Purchase;
