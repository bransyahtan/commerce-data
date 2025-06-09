import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  Box,
  Button,
  Container,
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchTransactionsFailure,
  fetchTransactionsStart,
  fetchTransactionsSuccess,
} from "../store/slices/transactionSlice";
import {
  fetchUsersFailure,
  fetchUsersStart,
  fetchUsersSuccess,
} from "../store/slices/userSlice";
import type { RootState } from "../store/store";

interface Transaction {
  id: number;
  userId: number;
  packageId: number;
  date: string;
  status: string;
  total: number;
}

interface Package {
  id: number;
  name: string;
  price: number;
  data: string;
  duration: string;
}

const ListCustomer: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state: RootState) => state.users);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUserTransactions, setSelectedUserTransactions] =
    React.useState<Transaction[]>([]);
  const [selectedUserPackages, setSelectedUserPackages] = React.useState<{
    [key: number]: Package;
  }>({});
  const [selectedUserName, setSelectedUserName] = React.useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(fetchUsersStart());
      try {
        const response = await axios.get(
          "http://localhost:3000/users?role_ne=1"
        );
        dispatch(fetchUsersSuccess(response.data));
      } catch (err) {
        dispatch(fetchUsersFailure("Gagal mengambil data pengguna."));
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengambil data pengguna.",
        });
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleViewPurchased = async (userId: number, userName: string) => {
    dispatch(fetchTransactionsStart());
    setSelectedUserName(userName);
    try {
      const response = await axios.get(
        `http://localhost:3000/transactions?userId=${userId}`
      );
      const transactionsData = response.data;
      setSelectedUserTransactions(transactionsData);

      const packageIds = transactionsData.map((t: Transaction) => t.packageId);
      const packagePromises = packageIds.map((id: number) =>
        axios.get(`http://localhost:3000/packages/${id}`)
      );
      const packageResponses = await Promise.all(packagePromises);
      const packageMap = packageResponses.reduce(
        (acc: { [key: number]: Package }, response) => {
          acc[response.data.id] = response.data;
          return acc;
        },
        {}
      );
      setSelectedUserPackages(packageMap);
      setOpenDialog(true);
    } catch (err) {
      dispatch(fetchTransactionsFailure("Gagal mengambil data transaksi."));
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data transaksi.",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserTransactions([]);
    setSelectedUserPackages({});
    setSelectedUserName("");
    dispatch(fetchTransactionsSuccess([]));
  };

  if (usersLoading) {
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
            Memuat data pengguna...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (usersError) {
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
            {usersError}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!usersLoading && users.length === 0) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/10471/10471220.png"
            width={120}
            alt="No Users"
            style={{ marginBottom: "16px" }}
          />
          <Typography variant="h6" color="text.secondary">
            Belum ada pelanggan yang terdaftar.
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
          <Box sx={{ mt: 4, mb: 6 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                textAlign: "center",
                mb: 4,
              }}
            >
              Daftar Pelanggan
            </Typography>
          </Box>
        </Fade>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            overflow: "auto",
            maxWidth: "100%",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                    }}
                  >
                    Nama
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                    }}
                  >
                    Username
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                    }}
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "1rem" }}>{user.name}</TableCell>
                    <TableCell sx={{ fontSize: "1rem" }}>
                      {user.username}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1,
                          px: 2,
                        }}
                        onClick={() => handleViewPurchased(user.id, user.name)}
                      >
                        Lihat Pembelian
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
            {users.map((user) => (
              <Paper
                key={user.id}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nama
                  </Typography>
                  <Typography variant="body1">{user.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1">{user.username}</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1,
                  }}
                  onClick={() => handleViewPurchased(user.id, user.name)}
                >
                  Lihat Pembelian
                </Button>
              </Paper>
            ))}
          </Box>
        </TableContainer>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Riwayat Pembelian {selectedUserName}
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{ p: 2, bgcolor: theme.palette.grey[50] }}
          >
            {selectedUserTransactions.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                  backgroundColor: "white",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  p: 3,
                }}
              >
                <ReceiptLongIcon
                  sx={{ fontSize: 50, color: theme.palette.grey[400], mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Pengguna ini belum memiliki transaksi.
                </Typography>
              </Box>
            ) : (
              <Box>
                {selectedUserTransactions.map((transaction: Transaction) => (
                  <Paper
                    key={transaction.id}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      mb: 2,
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Tanggal
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                      >
                        {new Date(transaction.date).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Paket
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                      >
                        {selectedUserPackages[transaction.packageId]?.name ||
                          "Memuat..."}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                      >
                        Rp {transaction.total.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        Status
                      </Typography>
                      <Chip
                        label={
                          transaction.status === "completed"
                            ? "Selesai"
                            : "Gagal"
                        }
                        color={
                          transaction.status === "completed"
                            ? "success"
                            : "error"
                        }
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Tutup
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ListCustomer;
