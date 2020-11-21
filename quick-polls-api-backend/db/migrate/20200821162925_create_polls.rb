class CreatePolls < ActiveRecord::Migration[6.0]
  def change
    create_table :polls do |t|
      t.string :question
      t.string :creator
      t.integer :period
      t.string :expiration_date
      t.integer :vote_requirement
      t.string :status

      t.timestamps
    end
  end
end
