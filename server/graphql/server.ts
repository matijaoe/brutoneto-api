import type { Place } from '@brutoneto/core'
import { detailedSalary } from '@brutoneto/core'
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
    // TODO: clean this up
    grossToNet: (_, { gross, config }: { gross: number, config: {
      place: Place
      ltax: number
      htax: number
      coeff: number
      third_pillar: number
    } }) => {
      return detailedSalary(gross, {
        place: config.place,
        taxRateLow: config.ltax,
        taxRateHigh: config.htax,
        personalAllowanceCoefficient: config.coeff,
        thirdPillarContribution: config.third_pillar
      })
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
