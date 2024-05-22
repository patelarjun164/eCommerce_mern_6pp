import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import Loader from "../../component/layout/Loader/Loader";
import { DELETE_USER_RESET } from "../../constants/userConstants";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const alert = useAlert();

  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { user } = useSelector(state => state.user);

  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    if(user._id.toString() === id.toString()){
        return alert.error("You Can Not Delete Yourself");
    }
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success(message);
      navigate("/admin/users");
        dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, isDeleted, message, navigate]);

  const isMobileView = window.innerWidth < 680;
  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: isMobileView ? 250 : 170,
      flex: isMobileView ? 0.9 : 0.5,
    },

    {
      field: "email",
      headerName: "Email",
      minWidth: isMobileView ? 220 : 160,
      flex: isMobileView ? 0.8 : 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: isMobileView ? 0.2 : 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <>
      <MetaData title={`ALL USERS - Admin`} />

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="dashboard">
            <SideBar />
            <div className="productListContainer">
              <h1 id="productListHeading">ALL USERS</h1>

              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UsersList;
