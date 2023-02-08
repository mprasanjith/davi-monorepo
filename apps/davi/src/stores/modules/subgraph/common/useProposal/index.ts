import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import { unix } from 'moment';
import { useQuery } from '@apollo/client';
import { getProposalDocument, getProposalQuery } from '.graphclient';
import { ContractState, Proposal } from 'types/types.guilds.d';
import { FetcherHooksInterface } from 'stores/types';
import { useProposalCalls } from 'stores/modules/common/fetchers';
import { useGetVotes } from '../useGetVotes';

type IUseProposal = FetcherHooksInterface['useProposal'];

export const useProposal: IUseProposal = (daoId, proposalId) => {
  const { data, error } = useQuery<getProposalQuery>(getProposalDocument, {
    variables: {
      id: daoId.toLowerCase(),
      proposalId: proposalId.toLowerCase(),
    },
  });
  const proposal = data?.guild?.proposals[0];

  const parsedData: Proposal = useMemo(() => {
    if (!proposal) return null;

    const {
      id,
      creator,
      startTime,
      endTime,
      to,
      data,
      value,
      title,
      contentHash,
      contractState,
      totalVotes,
    } = proposal;

    const contractStatesMapping = {
      1: ContractState.Active,
      2: ContractState.Rejected,
      3: ContractState.Executed,
      4: ContractState.Failed,
    };
    const mappedContractState = contractStatesMapping[parseInt(contractState)];

    const totalVotesBN = totalVotes.map((vote: string) => BigNumber.from(vote));

    return {
      id: id as `0x${string}`, // typecast to comply with template literal type
      creator,
      startTime: unix(startTime),
      endTime: unix(endTime),
      to,
      data,
      value,
      title,
      contentHash,
      contractState: mappedContractState,
      totalVotes: totalVotesBN,
      options: null,
      votes: null,
      totalOptions: null, // Not used in the codebase but in the deploy scripts
    };
  }, [proposal]);

  const { options } = useProposalCalls(daoId, proposalId, parsedData);
  const { data: votes } = useGetVotes(daoId, parsedData);

  if (parsedData) {
    if (options) parsedData.options = options;
    if (votes) parsedData.votes = votes;
  }

  return {
    data: parsedData,
    error,
  };
};
