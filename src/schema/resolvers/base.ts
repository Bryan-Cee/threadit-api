import { createResolver } from 'apollo-resolvers';
import { isInstance } from 'apollo-errors';

import { AuthenticationRequiredError, UnknownError } from "@threadit_errors";

export const base = createResolver(
  null,
  (root, args, context, error) => isInstance(error) ? error : new UnknownError()
);

export const isAuthenticatedResolver = base.createResolver(
  (root, args, { user }, info) => {
      if (!user) throw new AuthenticationRequiredError();
  }
);
