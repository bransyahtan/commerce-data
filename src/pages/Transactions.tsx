import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  Box,
  Chip,
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
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactionsFailure,
  fetchTransactionsStart,
  fetchTransactionsSuccess,
} from "../store/slices/transactionSlice";
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

const Transactions: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [packages, setPackages] = React.useState<{ [key: number]: Package }>(
    {}
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      dispatch(fetchTransactionsStart());
      try {
        const response = await axios.get(
          `http://localhost:3000/transactions?userId=${user.id}`
        );
        dispatch(fetchTransactionsSuccess(response.data));

        const packageIds = response.data.map((t: Transaction) => t.packageId);
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
        setPackages(packageMap);
      } catch (err) {
        dispatch(fetchTransactionsFailure("Gagal mengambil data transaksi"));
      }
    };

    fetchTransactions();
  }, [dispatch, user]);

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
      <Container>
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
              Riwayat Transaksi
            </Typography>
          </Box>
        </Fade>

        {transactions.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
              p: 4,
            }}
          >
            <ReceiptLongIcon
              sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Belum ada transaksi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transaksi Anda akan muncul di sini setelah pembelian berhasil
              dilakukan.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Desktop View */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  overflow: "auto",
                  maxWidth: "100%",
                }}
              >
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
                        Tanggal
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        Paket
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        Total
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction: Transaction) => (
                      <TableRow
                        key={transaction.id}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "rgba(0, 0, 0, 0.02)",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <TableCell sx={{ fontSize: "1rem" }}>
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
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          {packages[transaction.packageId]?.name ||
                            "Loading..."}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem", fontWeight: 600 }}>
                          Rp {transaction.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
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
                              fontSize: "0.9rem",
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {transactions.map((transaction: Transaction) => (
                <Paper
                  key={transaction.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tanggal
                    </Typography>
                    <Typography variant="body1">
                      {new Date(transaction.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Paket
                    </Typography>
                    <Typography variant="body1">
                      {packages[transaction.packageId]?.name || "Loading..."}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
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
                        transaction.status === "completed" ? "Selesai" : "Gagal"
                      }
                      color={
                        transaction.status === "completed" ? "success" : "error"
                      }
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Transactions;
