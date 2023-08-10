describe('login spec', () => {
  it('passes', () => {
    cy.visit('0.0.0.0:3000/')

    cy.contains('log in').click()

    cy.url().should('include', '/auth/login')
    cy.get('.email').type('test2@test.com')
    cy.get('.password').type('test2@test.com')
    cy.contains('Volunteer Login').click()

    cy.url().should('include', '/dash-volunteer')
    cy.contains('Click here to go to your profile').click({force:true})

    cy.url().should('include', '0.0.0.0:3000/volunteeraccounts/profile')

    cy.url().visit('http://0.0.0.0:3000/leaderboard')
    cy.url().visit('http://0.0.0.0:3000/h4i-team')
    cy.url().visit('http://0.0.0.0:3000/forum')
    cy.url().visit('http://0.0.0.0:3000/dash-volunteer')

    cy.get('.signout').click()
    cy.url().visit('http://0.0.0.0:3000/dash-volunteer')
    cy.url().should('include', '/auth/login')
    
    cy.url().visit('http://0.0.0.0:3000/leaderboard')
    cy.url().should('include', '/auth/login')
    cy.url().visit('http://0.0.0.0:3000/h4i-team')
    cy.url().should('include', '/auth/login')
    cy.url().visit('http://0.0.0.0:3000/forum')
    cy.url().should('include', '/auth/login')

    
    // cy.url().visit('http://0.0.0.0:3000/api/auth/signout')


  })
})