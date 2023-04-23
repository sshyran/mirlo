import { css } from "@emotion/css";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSnackbar } from "state/SnackbarContext";
import api from "../../services/api";
import { useGlobalStateContext } from "../../state/GlobalState";
import Button from "../common/Button";
import FormComponent from "../common/FormComponent";
import { InputEl } from "../common/Input";
import LoadingSpinner from "../common/LoadingSpinner";
import UserSupports from "./UserSupports";

function Profile() {
  const {
    state: { user },
    dispatch,
  } = useGlobalStateContext();
  const [isSaving, setIsSaving] = React.useState(false);

  const { register, handleSubmit } = useForm<{
    email: string;
    name: string;
  }>({
    defaultValues: {
      email: user?.email,
      name: user?.name,
    },
  });

  const fetchProfile = React.useCallback(async () => {
    const { result } = await api.get<LoggedInUser>("profile");
    dispatch({
      type: "setLoggedInUser",
      user: result,
    });
  }, [dispatch]);

  const userId = user?.id;
  const snackbar = useSnackbar();

  const doSave = React.useCallback(
    async (data: { email?: string; name: string }) => {
      if (userId) {
        try {
          setIsSaving(true);
          await api.put(`users/${userId}`, data);
          snackbar("Profile updated", { type: "success" });
        } catch (e) {
          snackbar("There was a problem with the API", { type: "warning" });
        } finally {
          setIsSaving(false);
        }
      }
    },
    [snackbar, userId]
  );

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!user) {
    return null;
  }

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <form
        onSubmit={handleSubmit(doSave)}
        className={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <h2>Profile</h2>
        <FormComponent>
          Email:
          <InputEl {...register("email")} />
        </FormComponent>
        <FormComponent>
          Name:
          <InputEl {...register("name")} />
        </FormComponent>
        <Button
          type="submit"
          disabled={isSaving}
          startIcon={isSaving ? <LoadingSpinner /> : undefined}
        >
          Update profile
        </Button>
      </form>
      {user.artistUserSubscriptions && (
        <UserSupports artistUserSubscriptions={user.artistUserSubscriptions} />
      )}
      <Link to="/profile/collection" style={{ marginTop: "1rem" }}>
        <Button style={{ width: "100%" }}>View collection</Button>
      </Link>

      <Link to="/manage" style={{ marginTop: "1rem" }}>
        <Button style={{ width: "100%" }}>Manage artists</Button>
      </Link>
    </div>
  );
}

export default Profile;