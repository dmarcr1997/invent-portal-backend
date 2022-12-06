use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_gifs = 0;
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;
        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
            likes: 0
        };

        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    pub fn add_like(ctx: Context<AddLike>, gif_link: String) -> Result <()> {
        let base_account = &mut ctx.accounts.base_account;
        let item_index = base_account.gif_list
            .iter()
            .position(|x| x.gif_link == gif_link);
        if item_index != None {
            let found_indx = item_index.unwrap();
            base_account.gif_list[found_indx].likes += 1;
            //add tip once likes get over 1000
        }
        Ok(())
    }

    pub fn remove_like(ctx: Context<RemoveLike>, gif_link: String) -> Result <()> {
        let base_account = &mut ctx.accounts.base_account;
        let item_index = base_account.gif_list
            .iter()
            .position(|x| x.gif_link == gif_link);
        if item_index != None {
            let found_indx = item_index.unwrap();
            base_account.gif_list[found_indx].likes -= 1;
            if base_account.gif_list[found_indx].likes < 0  {
                base_account.gif_list[found_indx].likes = 0;
            }
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddLike<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[derive(Accounts)]
pub struct RemoveLike<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub likes: i64,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
}