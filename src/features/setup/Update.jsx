import PropTypes from "prop-types";
import React, {
  useCallback,
  useEffect,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useTranslation } from "react-i18next";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Spinner from "../loading/Spinner";

import {
  selectHasOpkgBinary,
  selectStatus,
} from "../device/deviceSlice";

import {
  fetchUpgradable,
  selectFetchedUpgradable,
  selectProcessing,
  selectUpgradable,
  upgrade,
} from "../packages/packagesSlice";

export default function Update({ adb }) {
  const { t } = useTranslation("setup");
  const dispatch = useDispatch();

  const hasOpkgBinary = useSelector(selectHasOpkgBinary);
  const status = useSelector(selectStatus);
  const upgradable = useSelector(selectUpgradable);
  const fetchedUpgradable = useSelector(selectFetchedUpgradable);
  const isProcessing = useSelector(selectProcessing);

  useEffect(() => {
    if(!isProcessing && !fetchedUpgradable) {
      dispatch(fetchUpgradable(adb));
    }
  }, [adb, dispatch, fetchedUpgradable, isProcessing]);

  const handleWTFOSUpdate = useCallback(() => {
    dispatch(upgrade(adb));
  }, [adb, dispatch]);

  const renderedUpgradable = upgradable.map((item) => {
    return (
      <TableRow key={item.name}>
        <TableCell sx={{ width: 250 }}>
          {item.name}
        </TableCell>

        <TableCell>
          {item.current}
        </TableCell>

        <TableCell>
          {item.latest}
        </TableCell>
      </TableRow>
    );
  });

  return(
    <Stack spacing={2}>
      {isProcessing && !fetchedUpgradable &&
        <Spinner text={t("checking")} />}

      {upgradable.length > 0 &&
        <Button
          disabled={
            status === "installing" ||
            !hasOpkgBinary ||
            isProcessing ||
            upgradable.length === 0
          }
          onClick={handleWTFOSUpdate}
          variant="contained"
        >
          {t("update")}
        </Button>}

      {upgradable.length === 0 && !isProcessing &&
        <Alert severity="success">
          {t("upToDate")}
        </Alert>}

      {upgradable.length > 0 &&
        <TableContainer
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {t("name")}
                </TableCell>

                <TableCell>
                  {t("current")}
                </TableCell>

                <TableCell>
                  {t("latest")}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {renderedUpgradable}
            </TableBody>
          </Table>
        </TableContainer>}
    </Stack>
  );
}

Update.propTypes = { adb: PropTypes.shape().isRequired };
