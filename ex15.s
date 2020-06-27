	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	subq	$72, %rsp
	.cfi_def_cfa_offset 80
	movl	$8, %edi
	callq	_malloc
	movq	%rax, %rcx
	movl	$65, (%rax)
	movl	$8, %edi
	movq	%rax, 48(%rsp)          ## 8-byte Spill
	movq	%rcx, 40(%rsp)          ## 8-byte Spill
	callq	_malloc
	movq	%rax, %rcx
	movl	$66, (%rax)
	movl	$8, %edi
	movq	%rax, 32(%rsp)          ## 8-byte Spill
	movq	%rcx, 24(%rsp)          ## 8-byte Spill
	callq	_malloc
	movq	%rax, %rcx
	movl	$67, (%rax)
	movl	$8, %edi
	movq	%rax, 16(%rsp)          ## 8-byte Spill
	movq	%rcx, 8(%rsp)           ## 8-byte Spill
	callq	_malloc
	movq	%rax, %rcx
	movl	$68, (%rax)
	movq	$0, 8(%rax)
	movq	16(%rsp), %rax          ## 8-byte Reload
	movq	%rcx, 8(%rax)
	movq	32(%rsp), %rcx          ## 8-byte Reload
	movq	8(%rsp), %rdx           ## 8-byte Reload
	movq	%rdx, 8(%rcx)
	movq	48(%rsp), %rsi          ## 8-byte Reload
	movq	24(%rsp), %r8           ## 8-byte Reload
	movq	%r8, 8(%rsi)
	movq	40(%rsp), %r9           ## 8-byte Reload
	movq	%r9, 64(%rsp)
	movq	64(%rsp), %r10
	movq	%r10, 56(%rsp)
LBB0_1:                                 ## %loop_top20
                                        ## =>This Inner Loop Header: Depth=1
	cmpq	$0, 56(%rsp)
	je	LBB0_3
## %bb.2:                               ## %loop_body20
                                        ##   in Loop: Header=BB0_1 Depth=1
	movq	56(%rsp), %rax
	movl	(%rax), %edi
	callq	_putchar
	movq	56(%rsp), %rcx
	movq	8(%rcx), %rcx
	movq	%rcx, 56(%rsp)
	jmp	LBB0_1
LBB0_3:                                 ## %loop_exit20
	movl	$10, %edi
	callq	_putchar
	xorl	%ecx, %ecx
	movl	%eax, 4(%rsp)           ## 4-byte Spill
	movl	%ecx, %eax
	addq	$72, %rsp
	retq
	.cfi_endproc
                                        ## -- End function
.subsections_via_symbols
