import { Subtitle } from '../../../components/styles';
import { CalendarAdminPanel } from '../components/Admin';
import { PaginatedEventsList } from '../components/List';
import { useGetAuthUserQuery } from '../../auth/api/authApiSlice';

export const Calendar = () => {
  const { data: authUser } = useGetAuthUserQuery();

  return (
    <>
      <Subtitle>Calendar</Subtitle>
      {authUser.isAdmin && <CalendarAdminPanel />}
      <PaginatedEventsList />
    </>
  );
};
