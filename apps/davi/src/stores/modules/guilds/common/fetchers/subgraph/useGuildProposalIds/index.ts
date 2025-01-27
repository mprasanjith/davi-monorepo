import { useNetwork } from 'wagmi';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  getGuildProposalIdsQuery,
  getGuildProposalIdsDocument,
} from '.graphclient';
import { FetcherHooksInterface } from 'stores/types';
import { apolloClient } from 'clients/apollo';
import { SUPPORTED_DAVI_NETWORKS } from 'utils';

type IUseGuildProposalIds = FetcherHooksInterface['useGuildProposalIds'];

export const useGuildProposalIds: IUseGuildProposalIds = daoId => {
  const { chain } = useNetwork();
  const chainId: SUPPORTED_DAVI_NETWORKS = useMemo(() => chain?.id, [chain]);

  const { data, loading, error } = useQuery<getGuildProposalIdsQuery>(
    getGuildProposalIdsDocument,
    {
      client: apolloClient[chainId]['Guilds'],
      variables: { id: daoId?.toLowerCase() },
    }
  );

  const parsedData = useMemo(() => {
    return data?.guild?.proposals?.map(proposal => {
      const propid = proposal.id as `0x${string}`;
      return propid;
    });
  }, [data?.guild?.proposals]);

  const errorMessage = error?.message;

  return {
    data: parsedData,
    isLoading: loading,
    isError: !!error,
    errorMessage,
  };
};
