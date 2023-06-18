import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import AddTrade from '../components/addTrade/BasicModal';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'entryDate', label: 'Open Date', alignRight: false },
  { id: 'symbol', label: 'Symbol', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'netroi', label: 'Net ROI', alignRight: false },
  { id: 'longShort', label: 'Long / Short', alignRight: false },
  { id: 'contracts', label: 'Contracts', alignRight: false },
  { id: 'entryPrice', label: 'Entry Price', alignRight: false },
  { id: 'stopPrice', label: 'Stop Price', alignRight: false },
  { id: 'exitPrice', label: 'Exit Price', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'commission', label: 'Commission', alignRight: false },
  { id: 'netPnL', label: 'Net P&L', alignRight: false },
  { id: 'image', label: 'Image', alignRight: false },
  { id: 'edit', label: '', alignRight: false },
];


const createRandomTrades = () => {
  // Create 10 combinations of positions
  const positions = [];
  for (let i = 1; i <= 10; i += 1) {
    const position = {
      entryDate: '2023-06-18',
      symbol: 'NQ',
      status: 'Open',
      netroi: '',
      longShort: '',
      contracts: '',
      entryPrice: '',
      stopPrice: '',
      exitPrice: '',
      duration: '',
      commission: '',
      netPnL: '',
      image: 'url',
    };

    position.entryPrice = getRandomNumber(5000, 10000);
    position.stopPrice = getRandomNumber(4000, position.entryPrice);
    position.exitPrice = getRandomNumber(position.stopPrice, position.entryPrice);
    position.duration = getRandomNumber(1, 10);
    position.contracts = getRandomNumber(1, 12);
    position.commission = getRandomNumber(5, 50);
    position.netPnL = getRandomNumber(-100, 100);
    position.netroi = getRandomNumber(-500, 500);
    position.status = getRandomNumber(0, 2) > 1 ? "Win" : "Loss"
    position.longShort = getRandomNumber(0, 2) > 1 ? "Long" : "Short"
    positions.push(position);
  }

  // Utility function to generate random numbers within a range
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // console.log(positions);
  return positions;
}

// ----------------------------------------------------------------------






function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {


  const [openmodal, setIsOpenmodal] = useState(false);

  const handleOpenModal = () => {
    setIsOpenmodal(true);
  }




  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [trades, setTrades] = useState(createRandomTrades());

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Reports </title>
      </Helmet>


      <Container>



        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reports

          </Typography>
          <Button onClick={handleOpenModal} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add New Trade
          </Button>
          {openmodal && <AddTrade openModal={openmodal} handleOpenModal={setIsOpenmodal} />}
        </Stack>


        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {trades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((trade, indx) => {


                    return (
                      <TableRow hover key={indx} tabIndex={-1} role="checkbox" selected={trade}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={trade} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>

                            {trade.entryDate}

                          </Stack>
                        </TableCell>
                        <TableCell align="center">{trade.symbol}</TableCell>    {/* COLNAME: Symbol , VALUES: stock name */}

                        <TableCell align="center">{trade.status}</TableCell>   {/* COLNAME: STATUS , VALUES: WIN OR LOSS */}



                        <TableCell align="center">{trade.netroi}%</TableCell>   {/* COLNAME: Net ROI , VALUES: % of profit */}

                        <TableCell align="center">
                          <Label color={(trade.longShort === 'Short' && 'error') || 'success'}>{sentenceCase(trade.longShort)}</Label>   {/* COLNAME: LONG / Short */}
                        </TableCell>

                        <TableCell align="center">{trade.contracts}</TableCell>   {/* COLNAME: contracts , VALUES: decimal number */}


                        <TableCell align="center">{trade.entryPrice}</TableCell>   {/* COLNAME: Entry Price , VALUES: decimal number */}

                        <TableCell align="center">{trade.stopPrice}</TableCell>   {/* COLNAME: Stop  Price , VALUES: decimal number */}


                        <TableCell align="center">{trade.exitPrice}</TableCell>   {/* COLNAME: Exit Price , VALUES: decimal number */}


                        <TableCell align="center">{trade.duration}</TableCell>   {/* COLNAME: Duration , VALUES: time of duration */}



                        <TableCell align="center">{trade.commission}</TableCell>   {/* COLNAME: Commission , VALUES: Commission */}


                        <TableCell align="center">{trade.netPnL}</TableCell>   {/* COLNAME:  Net P&L, VALUES: float */}


                        <TableCell align="center">{trade.image}</TableCell>   {/* COLNAME: image, VALUES: image of trade */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}