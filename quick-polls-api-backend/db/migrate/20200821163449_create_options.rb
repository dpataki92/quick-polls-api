class CreateOptions < ActiveRecord::Migration[6.0]
  def change
    create_table :options do |t|
      t.string :description
      t.integer :poll_id

      t.timestamps
    end
  end
end
