import { SectionHeading, SmallButton } from '../../../../components/styles';
import * as Styled from './ProfileInfo.styles';

export const ProfileInfo = ({ user, onEdit }) => {
  if (!user) {
    return null;
  }

  return (
    <section>
      <Styled.SectionContainer>
        <Styled.HeadingContainer>
          <SectionHeading>Your Info</SectionHeading>
          <SmallButton onClick={onEdit}>Edit</SmallButton>
        </Styled.HeadingContainer>

        <Styled.List>
          <Styled.ListItem>
            <span>Name:</span>
            <span>{user.name}</span>
          </Styled.ListItem>
          <Styled.ListItem>
            <span>Email:</span>
            <span>{user.email}</span>
          </Styled.ListItem>
        </Styled.List>
      </Styled.SectionContainer>
    </section>
  );
};
