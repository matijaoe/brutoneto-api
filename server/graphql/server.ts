import type { GrossToNetConfig } from 'brutoneto'
import { detailedSalary } from 'brutoneto'
import { createSchema, createYoga } from 'graphql-yoga'

const typeDefs = /* GraphQL */ `
  input GrossToNetConfig {
    place: String
    ltax: Float
    htax: Float
    coeff: Float
    third_pillar: Float
  }

  type SalaryBreakdown {
    net: Float!  
    gross: Float!
    originalGross: Float
    totalCostToEmployer: Float!

    pension: PensionContribution!
    taxes: TaxBreakdown!
    healthInsurance: Float!
    income: Float!
    personalAllowance: Float!
    taxableIncome: Float!

    variables: SalaryVariables!
    calculations: SalaryCalculations
  }

  type PensionContribution {
    firstPilar: Float!
    secondPillar: Float!
    thirdPillar: Float!
    mandatoryTotal: Float!
    total: Float!
  }

  type TaxBreakdown {
    lowerBracket: Float!
    higherBracket: Float!
    total: Float!
  }

  type SalaryVariables {
    place: String
    taxRateLow: Float!
    taxRateHigh: Float!
    personalAllowanceCoefficient: Float!
    basicPersonalAllowance: Float!
  }

  type SalaryCalculations {
    netShareOfTotal: Float!
    netShareOfGross: Float!
    netShareOfInitialGross: Float
    wouldBeNetFromInitialGross: Float
    wouldBeNetShareOfInitialGross: Float
    netDifference: Float
  }

  type Query {
    # Calculate net amount from gross amount
    grossToNet(gross: Float!, config: GrossToNetConfig): SalaryBreakdown!
  }
`

const resolvers = {
  Query: {
    grossToNet: (_, { gross, config }: { gross: number, config: GrossToNetConfig }) => {
      return detailedSalary(gross, config)
    }
  }
}

// TODO: check if this is cached
export const yogaServer = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers
  })
})
