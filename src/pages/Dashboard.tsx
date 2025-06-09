import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  Grid,
  Grow,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deletePackageFailure,
  deletePackageStart,
  deletePackageSuccess,
  fetchPackagesFailure,
  fetchPackagesStart,
  fetchPackagesSuccess,
} from "../store/slices/packageSlice";
import type { RootState } from "../store/store";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { packages, loading, error } = useSelector(
    (state: RootState) => state.packages
  );
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    const fetchPackages = async () => {
      dispatch(fetchPackagesStart());
      try {
        const response = await axios.get("http://localhost:3000/packages");
        dispatch(fetchPackagesSuccess(response.data));
      } catch (err) {
        dispatch(fetchPackagesFailure("Gagal mengambil data paket"));
      }
    };

    fetchPackages();
  }, [dispatch]);

  const handlePurchase = (packageId: number) => {
    navigate(`/purchase/${packageId}`);
  };

  const handleDeleteClick = (packageId: number) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(deletePackageStart());
        try {
          await axios.delete(`http://localhost:3000/packages/${packageId}`);
          dispatch(deletePackageSuccess(packageId));
          Swal.fire("Dihapus!", "Paket Anda telah dihapus.", "success");
        } catch (err) {
          dispatch(deletePackageFailure("Gagal menghapus paket"));
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus paket.",
            "error"
          );
        }
      }
    });
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

  if (error) {
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
            {error}
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
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Box sx={{ mt: 4, mb: 6, textAlign: "center" }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 1,
              }}
            >
              Selamat datang, {userName}!
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Pilih Paket Data Internet
            </Typography>
          </Box>
        </Fade>

        {packages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
              p: 4,
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No Transactions"
              width="100"
              style={{ marginBottom: "16px" }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Belum ada paket data
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center", maxWidth: "600px" }}
            >
              {userRole === 1
                ? "Anda belum menambahkan paket data internet. Silakan tambahkan paket baru untuk ditampilkan di sini."
                : "Belum ada paket data internet yang tersedia saat ini. Silakan coba lagi nanti."}
            </Typography>
            {userRole === 1 && (
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/package/new")}
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                  boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 8px 2px rgba(76, 175, 80, .4)",
                  },
                }}
              >
                Tambah Paket Baru
              </Button>
            )}
          </Box>
        ) : (
          <>
            <Grid container spacing={4} justifyContent="center">
              {packages.map((pkg, index) => (
                <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                  <Grow
                    in
                    timeout={1000 + index * 200}
                    style={{ transformOrigin: "0 0 0" }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {pkg.name}
                        </Typography>
                        <Typography
                          variant="h4"
                          color="primary"
                          gutterBottom
                          sx={{
                            fontWeight: 700,
                            my: 2,
                          }}
                        >
                          Rp {pkg.price.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            color: theme.palette.text.secondary,
                            mb: 2,
                          }}
                        >
                          {pkg.data} / {pkg.duration}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          paragraph
                          sx={{ mb: 3 }}
                        >
                          {pkg.description}
                        </Typography>
                        {userRole !== 1 && (
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => handlePurchase(pkg.id)}
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
                                boxShadow:
                                  "0 5px 8px 2px rgba(33, 203, 243, .4)",
                              },
                            }}
                          >
                            Beli Sekarang
                          </Button>
                        )}
                        {userRole === 1 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              sx={{
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
                              onClick={() =>
                                navigate(`/package/edit/${pkg.id}`)
                              }
                            >
                              Edit Paket
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              fullWidth
                              sx={{
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
                              onClick={() => handleDeleteClick(pkg.id)}
                            >
                              Hapus Paket
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
            {userRole === 1 && (
              <Box sx={{ mt: 6, textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/package/new")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    background:
                      "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                    boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 5px 8px 2px rgba(76, 175, 80, .4)",
                    },
                  }}
                >
                  Tambah Paket Baru
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
