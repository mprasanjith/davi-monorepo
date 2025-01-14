import React, { useEffect, useState } from 'react';
import AddressButton from 'components/AddressButton/AddressButton';
import { ProposalDescription } from 'components/ProposalDescription';
import { StyledLink } from 'components/primitives/Links';
import { useTypedParams } from 'Modules/Guilds/Hooks/useTypedParams';
import { Loading } from 'components/primitives/Loading';
import { AiFillHome } from 'react-icons/ai';
import { IOrbisPost } from 'types/types.orbis';
import {
  ActionsGroup,
  ButtonContainer,
  HeaderTopRow,
  PageContainer,
  PageContent,
  PageHeader,
  PageTitle,
  PostDetailsRow,
  PostEditedBadge,
  TitleContainer,
} from './Discussion.styled';
import { useTranslation } from 'react-i18next';
import { SidebarCard, SidebarCardHeaderSpaced } from 'components/SidebarCard';
import { Header as CardHeader } from 'components/Card';
import { Discussion } from 'components/Discussion';
import useDiscussionContext from 'Modules/Guilds/Hooks/useDiscussionContext';
import { useOrbisContext } from 'contexts/Guilds/orbis';
import { useHookStoreProvider } from 'stores';
import PostActions from 'components/Discussion/Post/PostActions';
import moment from 'moment';
import { Button, IconButton } from 'components/primitives/Button';
import { linkStyles } from '../Proposal/Proposal.styled';

const DiscussionPage: React.FC = () => {
  const { t } = useTranslation();
  const { chainName, guildId, discussionId } = useTypedParams();

  const [op, setOp] = useState<IOrbisPost>();
  const {
    hooks: {
      fetchers: { useGuildConfig },
    },
  } = useHookStoreProvider();
  const { data: guildConfig } = useGuildConfig(guildId);
  const { orbis } = useOrbisContext();
  const { context } = useDiscussionContext(
    `${guildId}-${discussionId}-discussions`
  );

  const getPost = async () => {
    const { data } = await orbis.getPost(discussionId);
    setOp(data);
  };

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = () => {
    const confirmed = window.confirm(
      `${t('discussions.activity.deletionMessage1')}'\r\n${t(
        'discussions.activity.deletionMessage2'
      )}`
    );
    if (confirmed) {
      orbis.deletePost(discussionId);
    }
  };

  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <HeaderTopRow>
            <StyledLink
              to={`/${chainName}/${guildId}`}
              customStyles={linkStyles}
            >
              <IconButton
                data-testid="discussion-back-btn"
                variant="secondary"
                iconLeft
                padding={'0.6rem 0.8rem'}
                marginTop={'5px;'}
              >
                <AiFillHome style={{ marginRight: '15px' }} />{' '}
                {guildConfig?.name}
              </IconButton>
            </StyledLink>

            <ButtonContainer>
              <StyledLink
                to={`/${chainName}/${guildId}/discussion/${discussionId}/edit`}
              >
                <Button
                  variant="primaryWithBorder"
                  data-testid="edit-proposal-button"
                >
                  {t('editDiscussion.editDiscussion')}
                </Button>
              </StyledLink>
              <StyledLink
                to={`/${chainName}/${guildId}/create-proposal?ref=${discussionId}`}
              >
                <Button
                  variant="primaryWithBorder"
                  data-testid="create-proposal-button"
                >
                  {t('createProposal.createProposal')}
                </Button>
              </StyledLink>
            </ButtonContainer>
          </HeaderTopRow>
          <TitleContainer>
            <PageTitle data-testid="discussion-page-title">
              {op?.content?.title || (
                <Loading loading text skeletonProps={{ width: '800px' }} />
              )}
            </PageTitle>

            {op?.count_commits > 1 && (
              <PostEditedBadge>
                ({t('discussions.activity.postEdited')})
              </PostEditedBadge>
            )}
          </TitleContainer>
        </PageHeader>
        <PostDetailsRow>
          <AddressButton address={op?.creator_details.metadata?.address} />
          {op?.timestamp && moment.unix(op.timestamp).fromNow()}
        </PostDetailsRow>

        <ProposalDescription
          metadata={{ description: op?.content?.body }}
          error={null}
        />

        <ActionsGroup>
          <PostActions
            post={op}
            showThreadButton={false}
            onClickDelete={handleDelete}
          />
        </ActionsGroup>

        <SidebarCard
          header={
            <SidebarCardHeaderSpaced>
              <CardHeader>
                {t('discussions.activity.discussionTitle')}
              </CardHeader>
            </SidebarCardHeaderSpaced>
          }
        >
          {' '}
          <Discussion
            context={context}
            master={''}
            daoId={guildId}
            parentId={discussionId}
          />
        </SidebarCard>
      </PageContent>
    </PageContainer>
  );
};

export default DiscussionPage;
