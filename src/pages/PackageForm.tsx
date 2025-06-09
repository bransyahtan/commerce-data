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
  clearSelectedPackage,
  fetchPackageByIdFailure,
  fetchPackageByIdStart,
  fetchPackageByIdSuccess,
} from "../store/slices/packageSlice";
import type { RootState } from "../store/store";

interface PackageFormProps {
  isEditMode?: boolean;
}

const PackageForm: React.FC<PackageFormProps> = ({ isEditMode = false }) => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    selectedPackage,
    loading,
    error: packageError,
  } = useSelector((state: RootState) => state.packages);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [data, setData] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditMode && packageId) {
      const fetchPackage = async () => {
        dispatch(fetchPackageByIdStart());
        try {
          const response = await axios.get(
            `http://localhost:3000/packages/${packageId}`
          );
          dispatch(fetchPackageByIdSuccess(response.data));
        } catch (err) {
          dispatch(fetchPackageByIdFailure("Gagal mengambil data paket."));
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal mengambil data paket.",
          });
        }
      };
      fetchPackage();
    }

    return () => {
      dispatch(clearSelectedPackage());
    };
  }, [isEditMode, packageId, dispatch]);

  useEffect(() => {
    if (selectedPackage) {
      setName(selectedPackage.name);
      setPrice(selectedPackage.price.toString());
      setData(selectedPackage.data);
      setDuration(selectedPackage.duration);
      setDescription(selectedPackage.description);
    }
  }, [selectedPackage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const packageData = {
      name,
      price: parseInt(price),
      data,
      duration,
      description,
    };

    try {
      if (isEditMode && packageId) {
        await axios.put(
          `http://localhost:3000/packages/${packageId}`,
          packageData
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Paket berhasil diperbarui!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        await axios.post("http://localhost:3000/packages", packageData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Paket berhasil ditambahkan!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setName("");
          setPrice("");
          setData("");
          setDuration("");
          setDescription("");
          navigate("/dashboard");
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan paket.",
      });
    }
  };

  if (loading) {
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

  if (packageError) {
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
          <Typography color="error" variant="h6">
            {packageError}
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
      <Container component="main" maxWidth="sm">
        <Fade in timeout={1000}>
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={6}
              sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 3,
                  textAlign: "center",
                }}
              >
                {isEditMode ? "Edit Paket" : "Tambah Paket Baru"}
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 3, width: "100%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nama Paket"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Harga"
                  type="text"
                  value={price ? Number(price).toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setPrice(rawValue);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Data (misal: 1GB)"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Durasi (misal: 24 jam)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Deskripsi"
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <Divider sx={{ my: 3 }} />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
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
                  {isEditMode ? "Simpan Perubahan" : "Tambah Paket"}
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

export default PackageForm;
