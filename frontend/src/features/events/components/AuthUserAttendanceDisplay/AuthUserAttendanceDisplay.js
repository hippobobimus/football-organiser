import { CurrentAttendanceDisplay } from './CurrentAttendanceDisplay';
import { InitialAttendanceDisplay } from './InitialAttendanceDisplay';
import { PastAttendanceDisplay } from './PastAttendanceDisplay';

export const AuthUserAttendanceDisplay = ({
  isAttending,
  eventCategory,
  isFull,
  isFinished,
  guests,
  onJoin,
  onLeave,
  onRemoveGuest,
  onAddGuest,
}) => {
  if (isFinished) {
    <PastAttendanceDisplay
      attended={isAttending}
      eventCategory={eventCategory}
      guest={guests}
    />;
  }
  if (!isAttending) {
    return <InitialAttendanceDisplay onJoin={onJoin} />;
  }

  return (
    <CurrentAttendanceDisplay
      isAttending={isAttending}
      eventCategory={eventCategory}
      isFull={isFull}
      guests={guests}
      onLeave={onLeave}
      onAddGuest={onAddGuest}
      onRemoveGuest={onRemoveGuest}
    />
  );
};
