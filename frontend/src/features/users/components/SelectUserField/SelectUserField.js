import { Spinner } from '../../../../components/Spinner';
import { DisplayError } from '../../../../components/DisplayError';
import { SelectField } from '../../../../components/Form';
import { useGetUsersQuery } from '../../api/usersApiSlice';

export const SelectUserField = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <DisplayError error={error} />;
  }

  const usersOptionList = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <SelectField id="userId" label="User" name="userId">
      <option></option>
      {usersOptionList}
    </SelectField>
  );
};
